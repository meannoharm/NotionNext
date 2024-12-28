export interface CacheManager {
  getCache: (key: string) => any;
  setCache: (key: string, value: any) => void;
  delCache: (key: string) => void;
}
