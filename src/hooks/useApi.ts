import { useMemo } from "react";
import { ApiClientOptions, createApiClient } from "../core/api";
import { ApiConfig } from "../core/types";

export function useApi(config: ApiConfig, options: ApiClientOptions = {}) {
  const api = useMemo(() => {
    return createApiClient(config, options);
  }, [config, options]);

  return api;
}
