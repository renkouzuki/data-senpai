import { ReactNode } from "react";

/**
 * Options for data fetching operations
 */
export type FetchOptions = {
  /**
   * Cache control - can be a string like "1 hour" or boolean
   * @example "5 minutes", "1 hour", "2 days"
   */
  cache?: string | boolean;

  /** HTTP method to use */
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

  /** Custom request headers */
  headers?: Record<string, string>;

  /** Request body */
  body?: any;
};

/**
 * Response type for data fetching hooks
 */
export type FetchResponse<T> = {
  /** The fetched data */
  data: T;

  /** Error object if the request failed */
  error: Error | null;

  /** Whether the request is in progress */
  isLoading: boolean;

  /** Function to manually refresh the data */
  refresh: () => Promise<void>;
};

/**
 * Options for form submission operations
 */
export type SubmitOptions = {
  /** HTTP method to use */
  method?: "POST" | "PUT" | "DELETE" | "PATCH";

  /** Custom request headers */
  headers?: Record<string, string>;

  /** URLs of data to refresh after successful submission */
  refreshData?: string[];

  /** Callback for successful submission */
  onSuccess?: (data: any) => void;

  /** Callback for submission errors */
  onError?: (error: Error) => void;
};

/**
 * Response type for form submission hooks
 */
export type SubmitResponse = {
  /** Function to submit form data */
  submit: (data: any) => Promise<any>;

  /** Whether a submission is in progress */
  isSubmitting: boolean;

  /** Error object if the submission failed */
  error: Error | null;

  /** Response data from the last successful submission */
  data: any | null;
};

/**
 * Props for the LoadingFallback component
 */
export interface LoadingFallbackProps<T> {
  /** URL to fetch data from */
  fetch: string;

  /** Fetch options */
  options?: FetchOptions;

  /** Content to show while loading */
  fallback?: ReactNode;

  /** Render function for the fetched data */
  children: (data: T) => ReactNode;
}

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Render function for error state */
  fallback: (error: Error) => ReactNode;

  /** Child components that might throw errors */
  children: ReactNode;
}

/**
 * Props for the Link component
 */
export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** URL to navigate to */
  href: string;

  /** URL to prefetch data from on hover */
  prefetch?: string | null;
}

/**
 * Cache entry structure
 */
export type CacheEntry = {
  /** The cached data */
  data: any;

  /** Timestamp when the cache expires */
  expires: number;
};
