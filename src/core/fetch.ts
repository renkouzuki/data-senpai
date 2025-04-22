import {
  parseTime,
  getFromCache,
  addToCache,
  invalidateCache,
  isPreloading,
  addToPreloadSet,
  removeFromPreloadSet,
} from "./cache";
import { FetchOptions } from "./types";

export async function fetchData<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const isServer = typeof window === "undefined";

  try {
    const cacheKey = url;

    const cacheTime = options.cache
      ? typeof options.cache === "string"
        ? parseTime(options.cache)
        : 60 * 60 * 1000
      : 0;

    const skipCache = isServer && options.ssr !== true;
    const cachedData = skipCache ? null : getFromCache(cacheKey);

    if (cachedData !== null) {
      return cachedData as T;
    }

    const response = await fetch(url, {
      method: options.method || "GET",
      headers: options.headers || {
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      ...(options.nextConfig || {}),
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!skipCache && cacheTime > 0) {
      addToCache(cacheKey, data, cacheTime);
    }

    return data as T;
  } catch (error) {
    console.error("NextFetch error:", error);
    throw error;
  }
}

export function preloadData(url: string, options: FetchOptions = {}): void {
  if (typeof window === "undefined") return;

  if (isPreloading(url)) return;

  addToPreloadSet(url);

  fetchData(url, options).finally(() => {
    setTimeout(() => {
      removeFromPreloadSet(url);
    }, 10000);
  });
}

export function invalidateData(url: string): void {
  invalidateCache(url);
}
