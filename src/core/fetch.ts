import { FetchOptions } from "./types";
import {
  parseTime,
  getFromCache,
  addToCache,
  invalidateCache,
  isPreloading,
  addToPreloadSet,
  removeFromPreloadSet,
} from "./cache";

export async function fetchData<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const cacheKey = url;

    const cacheTime = options.cache
      ? typeof options.cache === "string"
        ? parseTime(options.cache)
        : 60 * 60 * 1000 
      : 0;

    const cachedData = getFromCache(cacheKey);
    if (cachedData !== null) {
      return cachedData as T;
    }

    const response = await fetch(url, {
      method: options.method || "GET",
      headers: options.headers || {
        "Content-Type": "application/json",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }

    const data = await response.json();

    if (cacheTime > 0) {
      addToCache(cacheKey, data, cacheTime);
    }

    return data as T;
  } catch (error) {
    console.error("NextFetch error:", error);
    throw error;
  }
}

export function preloadData(url: string, options: FetchOptions = {}): void {
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
