import { fetchData } from "./fetch";
import { ApiConfig, ApiEndpoint, FetchOptions } from "./types";

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
  status: number;
}

export interface ApiClientOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  getToken?: () => string | null;
  onError?: (error: Error, endpoint: string) => void;
  onSuccess?: (data: any, endpoint: string) => void;
}

class NextFetchApi {
  private config: ApiConfig;
  private options: ApiClientOptions;

  constructor(config: ApiConfig, options: ApiClientOptions = {}) {
    this.config = config;
    this.options = {
      baseUrl: "",
      defaultHeaders: {},
      getToken: () => null,
      ...options,
    };
  }

  private buildUrl(
    endpoint: ApiEndpoint,
    pathParams?: Record<string, any>
  ): string {
    let url = (this.options.baseUrl || "") + endpoint.url;

    if (pathParams) {
      Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, String(value));
      });
    }

    return url;
  }

  private buildHeaders(
    endpoint: ApiEndpoint,
    customToken?: string
  ): Record<string, string> {
    const headers = {
      "Content-Type": "application/json",
      ...this.options.defaultHeaders,
      ...endpoint.headers,
    };

    if (endpoint.auth) {
      const token = customToken || this.options.getToken?.();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private parseArgs(endpoint: ApiEndpoint, args: any[]) {
    const body: Record<string, any> = {};
    const pathParams: Record<string, any> = {};
    let token: string | undefined;

    if (!endpoint.params) {
      if (endpoint.auth && args.length > 0) {
        token = args[args.length - 1];
      }
      return { body, pathParams, token };
    }

    endpoint.params.forEach((paramName, index) => {
      const value = args[index];
      if (value === undefined) return;

      if (
        paramName === "token" ||
        (endpoint.auth && index === endpoint.params!.length - 1)
      ) {
        token = value;
      } else if (endpoint.url.includes(`{${paramName}}`)) {
        pathParams[paramName] = value;
      } else {
        body[paramName] = value;
      }
    });

    if (
      endpoint.auth &&
      !token &&
      args.length > (endpoint.params?.length || 0)
    ) {
      token = args[args.length - 1];
    }

    return { body, pathParams, token };
  }

  async callEndpoint<T = any>(
    endpointKey: string,
    args: any[] = []
  ): Promise<ApiResponse<T>> {
    const endpoint = this.config[endpointKey];

    if (!endpoint) {
      return {
        success: false,
        error: `Unknown endpoint: ${endpointKey}`,
        status: 0,
      };
    }

    try {
      const { body, pathParams, token } = this.parseArgs(endpoint, args);

      const url = this.buildUrl(endpoint, pathParams);
      const headers = this.buildHeaders(endpoint, token);

      const fetchOptions: FetchOptions = {
        method: endpoint.method,
        headers,
        cache: endpoint.cache,
        ssr: endpoint.ssr,
      };

      if (endpoint.method !== "GET" && Object.keys(body).length > 0) {
        fetchOptions.body = body;
      }

      console.log(`🚀 ${endpointKey}: ${endpoint.method} ${url}`);

      const data = await fetchData<T>(url, fetchOptions);

      const response: ApiResponse<T> = {
        success: true,
        data,
        status: 200,
      };

      this.options.onSuccess?.(data, endpointKey);
      return response;
    } catch (error) {
      console.error(`❌ API Error for ${endpointKey}:`, error);

      const apiError =
        error instanceof Error ? error : new Error("Unknown error");
      this.options.onError?.(apiError, endpointKey);

      return {
        success: false,
        error: apiError.message,
        status: 0,
      };
    }
  }

  updateConfig(newConfig: Partial<ApiConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  addEndpoint(key: string, endpoint: ApiEndpoint) {
    this.config[key] = endpoint;
  }
}

export function createApiClient(
  config: ApiConfig,
  options: ApiClientOptions = {}
) {
  const apiInstance = new NextFetchApi(config, options);

  const api = new Proxy({} as any, {
    get(target, prop: string) {
      if (prop in config) {
        return (...args: any[]) => apiInstance.callEndpoint(prop, args);
      }

      if (prop === "updateConfig")
        return apiInstance.updateConfig.bind(apiInstance);
      if (prop === "addEndpoint")
        return apiInstance.addEndpoint.bind(apiInstance);
      if (prop === "callEndpoint")
        return apiInstance.callEndpoint.bind(apiInstance);

      return undefined;
    },
  });

  return api;
}
