import React from "react";
import { LoadingFallbackProps } from "../core/types";
import { useServerData } from "../hooks/useServerData";

export function LoadingFallback<T>({
  fetch: url,
  options = {},
  fallback = <div>Loading...</div>,
  children,
}: LoadingFallbackProps<T>): React.ReactElement {
  const { data, isLoading, error } = useServerData<T>(url, options);

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (error) {
    return <div className="next-fetch-error">Error: {error.message}</div>;
  }

  return <>{children(data)}</>;
}

export default LoadingFallback;
