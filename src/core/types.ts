import { ReactNode } from "react";

export type FetchOptions = {
  cache?: string | boolean;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  ssr?: boolean; 
  nextConfig?: Record<string, any>; 
};

export type FetchResponse<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

export type SubmitOptions = {
  method?: "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  refreshData?: string[];
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
};

export type SubmitResponse = {
  submit: (data: any) => Promise<any>;
  isSubmitting: boolean;
  error: Error | null;
  data: any | null;
};

export interface LoadingFallbackProps<T> {
  fetch: string;
  options?: FetchOptions;
  fallback?: ReactNode;
  children: (data: T) => ReactNode;
}

export interface ErrorBoundaryProps {
  fallback: (error: Error) => ReactNode;
  children: ReactNode;
}

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  prefetch?: string | null;
}

export type CacheEntry = {
  data: any;
  expires: number;
};

export interface ApiEndpoint {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  auth?: boolean;
  cache?: string | boolean;
  ssr?: boolean;
  headers?: Record<string, string>;
  params?: string[];
}

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

export type ApiConfig = Record<string, ApiEndpoint>;