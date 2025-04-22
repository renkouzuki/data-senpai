import { CacheEntry } from "./types";

const isServer = typeof window === "undefined";
let SERVER_CACHE_STORE: Map<string, CacheEntry> = new Map();
let SERVER_PRELOAD_REQUESTS: Set<string> = new Set();

export const getCacheStore = () => {
  if (isServer) {
    return SERVER_CACHE_STORE;
  }
  if (typeof window !== "undefined") {
    window.__NEXT_FETCH_CACHE =
      window.__NEXT_FETCH_CACHE || new Map<string, CacheEntry>();
    return window.__NEXT_FETCH_CACHE;
  }
  return new Map<string, CacheEntry>(); 
};

export const getPreloadRequests = () => {
  if (isServer) {
    return SERVER_PRELOAD_REQUESTS;
  }
  if (typeof window !== "undefined") {
    window.__NEXT_FETCH_PRELOADS =
      window.__NEXT_FETCH_PRELOADS || new Set<string>();
    return window.__NEXT_FETCH_PRELOADS;
  }
  return new Set<string>(); 
};

export function parseTime(time: string): number {
  const num = parseInt(time.split(" ")[0]);

  if (time.includes("second")) return num * 1000;
  if (time.includes("minute")) return num * 60 * 1000;
  if (time.includes("hour")) return num * 60 * 60 * 1000;
  if (time.includes("day")) return num * 24 * 60 * 60 * 1000;

  return 60 * 60 * 1000;
}

export function getFromCache(url: string): any | null {
  const cacheStore = getCacheStore();
  const cacheEntry = cacheStore.get(url);

  if (cacheEntry && cacheEntry.expires > Date.now()) {
    return cacheEntry.data;
  }

  return null;
}

export function addToCache(url: string, data: any, cacheTime: number): void {
  if (cacheTime <= 0) return;

  const cacheStore = getCacheStore();
  cacheStore.set(url, {
    data,
    expires: Date.now() + cacheTime,
  });
}

export function invalidateCache(url: string): void {
  const cacheStore = getCacheStore();
  cacheStore.delete(url);
}

export function clearCache(): void {
  const cacheStore = getCacheStore();
  cacheStore.clear();
}

export function addToPreloadSet(url: string): void {
  const preloadRequests = getPreloadRequests();
  preloadRequests.add(url);
}

export function removeFromPreloadSet(url: string): void {
  const preloadRequests = getPreloadRequests();
  preloadRequests.delete(url);
}

export function isPreloading(url: string): boolean {
  const preloadRequests = getPreloadRequests();
  return preloadRequests.has(url);
}
