import { CacheEntry } from "./types";

/**
 * Global cache store for data fetching
 */
export const CACHE_STORE = new Map<string, CacheEntry>();

/**
 * Set of URLs that are currently being preloaded
 */
export const PRELOAD_REQUESTS = new Set<string>();

/**
 * Convert human-readable cache times to milliseconds
 *
 * @param time - Cache time in human-readable format (e.g., "5 minutes", "1 hour")
 * @returns Number of milliseconds
 */
export function parseTime(time: string): number {
  const num = parseInt(time.split(" ")[0]);

  if (time.includes("second")) return num * 1000;
  if (time.includes("minute")) return num * 60 * 1000;
  if (time.includes("hour")) return num * 60 * 60 * 1000;
  if (time.includes("day")) return num * 24 * 60 * 60 * 1000;

  // Default to 1 hour if format is not recognized
  return 60 * 60 * 1000;
}

/**
 * Get data from cache if it exists and is not expired
 *
 * @param url - Cache key (usually the fetch URL)
 * @returns Cached data or null if not found or expired
 */
export function getFromCache(url: string): any | null {
  const cacheEntry = CACHE_STORE.get(url);

  if (cacheEntry && cacheEntry.expires > Date.now()) {
    return cacheEntry.data;
  }

  return null;
}

/**
 * Add data to the cache with an expiration time
 *
 * @param url - Cache key (usually the fetch URL)
 * @param data - Data to cache
 * @param cacheTime - Cache duration in milliseconds
 */
export function addToCache(url: string, data: any, cacheTime: number): void {
  if (cacheTime <= 0) return;

  CACHE_STORE.set(url, {
    data,
    expires: Date.now() + cacheTime,
  });
}

/**
 * Remove data from the cache
 *
 * @param url - Cache key to invalidate
 */
export function invalidateCache(url: string): void {
  CACHE_STORE.delete(url);
}

/**
 * Clear the entire cache
 */
export function clearCache(): void {
  CACHE_STORE.clear();
}

/**
 * Add URL to the preload set
 *
 * @param url - URL being preloaded
 */
export function addToPreloadSet(url: string): void {
  PRELOAD_REQUESTS.add(url);
}

/**
 * Remove URL from the preload set
 *
 * @param url - URL to remove from preload set
 */
export function removeFromPreloadSet(url: string): void {
  PRELOAD_REQUESTS.delete(url);
}

/**
 * Check if a URL is already being preloaded
 *
 * @param url - URL to check
 * @returns Boolean indicating if URL is in preload set
 */
export function isPreloading(url: string): boolean {
  return PRELOAD_REQUESTS.has(url);
}
