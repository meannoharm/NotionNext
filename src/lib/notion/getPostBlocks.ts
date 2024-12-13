import { NotionAPI } from 'notion-client';
import { getDataFromCache, setDataToCache } from '@/lib/cache/cacheManager';
import { delay } from '../utils';
import { cloneDeep } from 'lodash';
import { NOTION_ACCESS_TOKEN } from '@/constants';

import type { ExtendedRecordMap } from '@/types/notion';

/**
 * 获取文章内容
 * get the content of line Block which type is 'Post'
 * @param {*} id
 * @param {*} from
 * @param {*} slice
 * @returns
 */
export async function getPostBlocks(
  id: string,
  from: string,
  slice?: number,
): Promise<ExtendedRecordMap> {
  const cacheKey = `post_block_${id}`;

  try {
    const pageBlockMapFromCache =
      await getDataFromCache<ExtendedRecordMap>(cacheKey);
    if (pageBlockMapFromCache) {
      console.log('[缓存]:', `from:${from}`, cacheKey);
      return filterPostBlockMap(id, pageBlockMapFromCache, slice);
    }

    const start = new Date().getTime();
    const pageBlockMapFromApi = await getPageWithRetry(id, from);
    const end = new Date().getTime();
    console.log('[API耗时]', `${end - start}ms`);

    if (pageBlockMapFromApi) {
      await setDataToCache(cacheKey, pageBlockMapFromApi);
      return filterPostBlockMap(id, pageBlockMapFromApi, slice);
    }
  } catch (e) {
    console.error('获取文章内容失败', e);
  }

  throw Error('获取文章内容失败');
}

/**
 * 调用接口，失败会重试
 * @param {*} id
 * @param {*} retryAttempts
 */
export async function getPageWithRetry(
  id: string,
  from: string,
  retryAttempts = 3,
): Promise<ExtendedRecordMap> {
  if (retryAttempts && retryAttempts > 0) {
    console.log(
      '[请求API]',
      `from:${from}`,
      `id:${id}`,
      retryAttempts < 3 ? `剩余重试次数:${retryAttempts}` : '',
    );
    try {
      const authToken = NOTION_ACCESS_TOKEN || '';
      const api = new NotionAPI({
        authToken,
        userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      const pageData = await api.getPage(id);
      console.info('[响应成功]:', `from:${from}`);
      return pageData;
    } catch (e) {
      console.warn('[响应异常]:', e);
      await delay(1000);
      const cacheKey = 'page_block_' + id;
      const pageBlock = await getDataFromCache<ExtendedRecordMap>(cacheKey);
      if (pageBlock) {
        console.log('[重试缓存]', `from:${from}`, `id:${id}`);
        return pageBlock;
      }
      return await getPageWithRetry(id, from, retryAttempts - 1);
    }
  } else {
    console.error('[请求失败]:', `from:${from}`, `id:${id}`);
    throw new Error('请求失败');
  }
}

/**
 * 获取到的blockMap删除不需要的字段
 * @param {*} id 页面ID
 * @param {*} pageBlockMap 页面元素
 * @param {*} slice 截取数量
 * @returns
 */
function filterPostBlockMap(
  id: string,
  pageBlockMap: ExtendedRecordMap,
  slice?: number,
) {
  const clonePageBlock = cloneDeep(pageBlockMap);
  let count = 0;

  for (const [key, block] of Object.entries(clonePageBlock.block)) {
    if (slice && slice > 0 && count > slice) {
      delete clonePageBlock.block[key];
      continue;
    }
    // 当BlockId等于PageId时移除
    if (block.value?.id === id) {
      // 此block含有敏感信息
      delete block.value?.properties;
      continue;
    }

    count++;
    // 处理 c++、c#、汇编等语言名字映射
    if (block.value?.type === 'code') {
      if (block.value?.properties?.language?.[0][0] === 'C++') {
        block.value.properties.language[0][0] = 'cpp';
      }
      if (block.value?.properties?.language?.[0][0] === 'C#') {
        block.value.properties.language[0][0] = 'csharp';
      }
      if (block.value?.properties?.language?.[0][0] === 'Assembly') {
        block.value.properties.language[0][0] = 'asm6502';
      }
    }

    // delete b?.role;
    // delete b?.value?.version;
    // delete b?.value?.created_by_table;
    // delete b?.value?.created_by_id;
    // delete b?.value?.last_edited_by_table;
    // delete b?.value?.last_edited_by_id;
    // delete b?.value?.space_id;
  }

  // 去掉不用的字段
  // if (id === BLOG.NOTION_PAGE_ID) {
  //   return clonePageBlock;
  // }
  return clonePageBlock;
}
