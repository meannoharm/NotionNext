import cache from 'memory-cache';
import { isProduct } from '@/lib/utils';

const cacheTime = isProduct() ? 10 * 60 : 120 * 60; // 120 minutes for dev,10 minutes for prod

export async function getCache(key: string) {
  return await cache.get(key);
}

export async function setCache(key: string, data: any) {
  await cache.put(key, data, cacheTime * 1000);
}

export async function delCache(key: string) {
  await cache.del(key);
}

const memoryCache = { getCache, setCache, delCache };

export default memoryCache;
