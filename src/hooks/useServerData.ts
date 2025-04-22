import { useState, useEffect, useCallback } from "react";
import { FetchOptions, FetchResponse } from "../core/types";
import { fetchData } from "../core/fetch";

export function useServerData<T>(
  url: string,
  options: FetchOptions = {}
): FetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const freshData = await fetchData<T>(url, options);
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    setData(null);
    setError(null);
    setLoading(true);

    refresh();
  }, [url, refresh]);

  return {
    data: data as T,
    error,
    isLoading,
    refresh,
  };
}
