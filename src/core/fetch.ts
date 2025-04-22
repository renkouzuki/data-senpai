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

/**
 * Main data fetching function for server components
 *
 * @param url - URL to fetch data from
 * @param options - Fetch options including caching
 * @returns Promise resolving to the fetched data
 */
export async function fetchData<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const cacheKey = url;

    // Determine cache time from options
    const cacheTime = options.cache
      ? typeof options.cache === "string"
        ? parseTime(options.cache)
        : 60 * 60 * 1000 // 1 hour default if cache is just true
      : 0; // No caching if cache option is falsy

    // Check cache first
    const cachedData = getFromCache(cacheKey);
    if (cachedData !== null) {
      return cachedData as T;
    }

    // Fetch fresh data
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

    // Update cache if caching is enabled
    if (cacheTime > 0) {
      addToCache(cacheKey, data, cacheTime);
    }

    return data as T;
  } catch (error) {
    console.error("NextFetch error:", error);
    throw error;
  }
}

/**
 * Preload data in the background
 *
 * @param url - URL to preload data from
 * @param options - Fetch options including caching
 */
export function preloadData(url: string, options: FetchOptions = {}): void {
  // Don't preload the same URL multiple times
  if (isPreloading(url)) return;

  addToPreloadSet(url);

  // Fetch in the background
  fetchData(url, options).finally(() => {
    // Remove from preload set after a delay
    setTimeout(() => {
      removeFromPreloadSet(url);
    }, 10000); // Keep in set for 10 seconds to prevent duplicate preloads
  });
}

/**
 * Invalidate cached data for a specific URL
 *
 * @param url - URL to invalidate in cache
 */
export function invalidateData(url: string): void {
  invalidateCache(url);
}
