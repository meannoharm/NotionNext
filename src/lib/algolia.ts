import getPageContentText from '@/lib/notion/getPageContentText';
import { algoliasearch } from 'algoliasearch';
import dayjs from 'dayjs';
import {
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_ADMIN_API_KEY,
  ALGOLIA_INDEX_NAME,
} from '@/constants';

import type { ExtendedRecordMap, Page } from '@/types/notion';

export interface AlgoliaRecord {
  objectID: string;
  title: string;
  category: string;
  tags: string[];
  pageCover: string;
  slug: string;
  summary: string;
  lastEditedDate: number;
  lastIndexDate: number;
  content: string;
}

/**
 * 生成全文索引
 * @param {*} allPages
 */
const generateAlgoliaSearch = async (allPages: Page[]) => {
  allPages?.forEach((p) => {
    // 判断这篇文章是否需要重新创建索引
    if (p && !p.password) {
      uploadDataToAlgolia(p);
    }
  });
};

/**
 * 上传数据
 * 根据上次修改文章日期和上次更新索引数据判断是否需要更新algolia索引
 */
const uploadDataToAlgolia = async (post: Page) => {
  // Connect and authenticate with your Algolia app
  const client = algoliasearch(ALGOLIA_APPLICATION_ID, ALGOLIA_ADMIN_API_KEY);


  if (!post) {
    return;
  }

  // 检查是否有索引
  let needUpdateIndex = false;
  try {
    const existed = await client.getObject({indexName: ALGOLIA_INDEX_NAME, objectID: post.id});
    if (!existed || !existed?.lastEditedDate || !existed?.lastIndexDate) {
      needUpdateIndex = true;
    } else if (
     dayjs(post.lastEditedDate).isAfter(dayjs(existed.lastIndexDate as number))
    ) {
      needUpdateIndex = true;
    }
  } catch (error) {
    console.log(error);
    if ((error as Error).message.includes('ObjectID does not exist')) {
      needUpdateIndex = true;
    }
  }

  // 如果需要更新搜索
  if (needUpdateIndex) {
    const record = {
      objectID: post.id,
      title: post.title,
      category: post.category,
      tags: post.tags,
      pageCover: post.pageCover,
      slug: post.slug,
      summary: post.summary,
      lastEditedDate: post.lastEditedDate, // 更新文章时间
      lastIndexDate: dayjs().valueOf(), // 更新索引时间
      content: truncate(
        getPageContentText(post, post.blockMap as ExtendedRecordMap).join(''),
        9000,
      ), // 索引9000个字节，因为api限制总请求内容上限1万个字节
    };

    // console.log('更新Algolia索引', record)
    client.saveObject({indexName: ALGOLIA_INDEX_NAME, body: record})
      .then((r) => {
        console.log('Algolia索引更新', r);
      })
      .catch((err) => {
        console.log('Algolia异常', err);
      });
  }
};

/**
 * 限制内容字节数
 * @param {*} str
 * @param {*} maxBytes
 * @returns
 */
function truncate(str: string, maxBytes: number) {
  let count = 0;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x7f) {
      count += 1;
    } else if (code <= 0x7ff) {
      count += 2;
    } else if (code <= 0xffff) {
      count += 3;
    } else {
      count += 4;
    }
    if (count <= maxBytes) {
      result += str[i];
    } else {
      break;
    }
  }
  return result;
}

export { uploadDataToAlgolia, generateAlgoliaSearch };
