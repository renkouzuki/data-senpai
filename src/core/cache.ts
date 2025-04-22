import { CacheEntry } from "./types";

export const CACHE_STORE = new Map<string, CacheEntry>();

export const PRELOAD_REQUESTS = new Set<string>();

export function parseTime(time: string): number {
  const num = parseInt(time.split(" ")[0]);

  if (time.includes("second")) return num * 1000;
  if (time.includes("minute")) return num * 60 * 1000;
  if (time.includes("hour")) return num * 60 * 60 * 1000;
  if (time.includes("day")) return num * 24 * 60 * 60 * 1000;

  return 60 * 60 * 1000;
}

export function getFromCache(url: string): any | null {
  const cacheEntry = CACHE_STORE.get(url);

  if (cacheEntry && cacheEntry.expires > Date.now()) {
    return cacheEntry.data;
  }

  return null;
}

export function addToCache(url: string, data: any, cacheTime: number): void {
  if (cacheTime <= 0) return;

  CACHE_STORE.set(url, {
    data,
    expires: Date.now() + cacheTime,
  });
}

export function invalidateCache(url: string): void {
  CACHE_STORE.delete(url);
}

export function clearCache(): void {
  CACHE_STORE.clear();
}

export function addToPreloadSet(url: string): void {
  PRELOAD_REQUESTS.add(url);
}

export function removeFromPreloadSet(url: string): void {
  PRELOAD_REQUESTS.delete(url);
}

export function isPreloading(url: string): boolean {
  return PRELOAD_REQUESTS.has(url);
}
