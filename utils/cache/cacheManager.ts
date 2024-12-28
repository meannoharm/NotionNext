import memoryCache from './memoryMache';
import fileCache from './localFileCache';
import mongoCache from './mongoDbCache';
import {
  ENABLE_CACHE,
  ENABLE_FILE_CACHE,
  MONGO_DB_NAME,
  MONGO_DB_URL,
} from '@/constants';
import type { CacheManager } from './types';

let cacheManager: CacheManager;
if (MONGO_DB_URL && MONGO_DB_NAME) {
  cacheManager = mongoCache;
} else if (ENABLE_FILE_CACHE) {
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
  if (ENABLE_CACHE || force) {
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
  if (!ENABLE_CACHE) {
    return;
  }
  await cacheManager.delCache(key);
}
