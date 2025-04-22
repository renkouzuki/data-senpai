import { useState, useEffect, useCallback, useRef } from "react";
import { FetchOptions, FetchResponse } from "../core/types";
import { fetchData } from "../core/fetch";

export function useServerData<T>(
  url: string,
  options: FetchOptions = {}
): FetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const isMounted = useRef(true);
  const shouldFetch = typeof url === "string" && url.length > 0;

  const refresh = useCallback(async () => {
    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const freshData = await fetchData<T>(url, options);
      if (isMounted.current) {
        setData(freshData);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [url, options, shouldFetch]);

  useEffect(() => {
    isMounted.current = true;

    if (shouldFetch) {
      setData(null);
      setError(null);
      setLoading(true);
      refresh();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [url, refresh, shouldFetch]);

  return {
    data,
    error,
    isLoading,
    refresh,
  };
}
