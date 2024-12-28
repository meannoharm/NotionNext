import fs from 'fs';
import path from 'path';

// 文件缓存持续10秒
const cacheInvalidSeconds = 1000000000 * 1000;
// 文件名
const jsonFile = path.resolve('./data.json');

export async function getCache(key: string) {
  const exist = await fs.existsSync(jsonFile);
  if (!exist) return null;
  const data = await fs.readFileSync(jsonFile);
  let json = null;
  if (!data) return null;
  try {
    json = JSON.parse(data.toString());
  } catch (error) {
    console.error('读取JSON缓存文件失败', data);
    console.error(error);
    return null;
  }
  // 缓存超过有效期就作废
  const cacheValidTime = new Date(
    parseInt(json[key + '_expire_time']) + cacheInvalidSeconds,
  );
  const currentTime = new Date();
  if (!cacheValidTime || cacheValidTime < currentTime) {
    return null;
  }
  return json[key];
}

/**
 * 并发请求写文件异常； Vercel生产环境不支持写文件。
 * @param key
 * @param data
 * @returns {Promise<null>}
 */
export function setCache(key: string, data: any) {
  const exist = fs.existsSync(jsonFile);
  const json = exist ? JSON.parse(fs.readFileSync(jsonFile).toString()) : {};
  json[key] = data;
  json[key + '_expire_time'] = new Date().getTime();
  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

export function delCache(key: string) {
  const exist = fs.existsSync(jsonFile);
  const json = exist ? JSON.parse(fs.readFileSync(jsonFile).toString()) : {};
  delete json.key;
  json[key + '_expire_time'] = new Date().getTime();
  fs.writeFileSync(jsonFile, JSON.stringify(json));
}

const localFileCache = { getCache, setCache, delCache };

export default localFileCache;
