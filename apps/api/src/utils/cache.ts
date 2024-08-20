import NodeCache from 'node-cache';
const cache = new NodeCache();

/**
 * Retrieves data from the cache.
 * @param key - The key to retrieve.
 * @param func - The function to execute if the key is not found in the cache.
 * @param ttl - The time to live for the cache entry in seconds. Default is 1 hour.
 * @returns The cached data or the result of the function execution.
 */
export async function getFromCache(
  key: string,
  func: () => Promise<any>,
  ttl: number = 60 * 60, // 1 hour
): Promise<any> {
  const value = cache.get(key);
  if (value) {
    return value;
  }

  const result = await func();
  cache.set(key, result, ttl);

  return result;
}

/**
 * Checks if a key exists in the cache.
 * @param key - The key to check.
 * @returns True if the key exists, false otherwise.
 */
export function keyExists(key: string): boolean {
  return cache.has(key);
}

/**
 * Removes a key from the cache.
 * @param key - The key to remove.
 */
export function removeFromCache(key: string): void {
  cache.del(key);
}

/**
 * Clears the entire cache.
 */
export function clearCache(): void {
  cache.flushAll();
}
