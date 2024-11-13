import memoryCache from './memoryMache';
import fileCache from './localFileCache';
import mongoCache from './mongoDbCache';
import BLOG from '@/blog.config';

import type { CacheManager } from './types';

let cacheManager: CacheManager;
if (process.env.MONGO_DB_URL && process.env.MONGO_DB_NAME) {
  cacheManager = mongoCache;
} else if (process.env.ENABLE_FILE_CACHE) {
  cacheManager = fileCache;
} else {
  cacheManager = memoryCache;
}

/**
 * 为减少频繁接口请求，notion数据将被缓存
 * @param {*} key
 * @returns
 */
export async function getDataFromCache<T>(
  key: string,
  force?: boolean,
): Promise<T | null> {
  if (BLOG.ENABLE_CACHE || force) {
    const dataFromCache = await cacheManager.getCache(key);
    if (JSON.stringify(dataFromCache) === '[]') {
      return null;
    }
    return cacheManager.getCache(key);
  } else {
    return null;
  }
}

export async function setDataToCache<T>(key: string, data: T) {
  if (!data) {
    return;
  }
  await cacheManager.setCache(key, data);
}

export async function delCacheData(key: string) {
  if (!BLOG.ENABLE_CACHE) {
    return;
  }
  await cacheManager.delCache(key);
}
