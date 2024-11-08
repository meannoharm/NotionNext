import BLOG from '@/blog.config';
import { idToUuid } from 'notion-utils';
import { getPostBlocks } from './getPostBlocks';
import { defaultMapImageUrl } from 'react-notion-x';

import type { Block } from './types';

/**
 * 根据页面ID获取内容
 * @param {*} pageId
 * @returns
 */
export async function getNotion(pageId: string) {
  const blockMap = await getPostBlocks(pageId, 'slug');
  if (!blockMap) {
    return null;
  }

  const postInfo = blockMap?.block?.[idToUuid(pageId)].value;

  return {
    id: pageId,
    type: postInfo,
    category: '',
    tags: [],
    title: postInfo?.properties?.title?.[0],
    status: 'Published',
    createdTime: postInfo.created_time,
    lastEditedDay: postInfo?.last_edited_time,
    pageCover: getPageCover(postInfo),
    date: {
      startDate: postInfo?.last_edited_time,
    },
    blockMap,
  };
}

function getPageCover(postInfo: Block) {
  const pageCover = postInfo.format?.page_cover;
  if (pageCover) {
    if (pageCover.startsWith('/')) return BLOG.NOTION_HOST + pageCover;
    if (pageCover.startsWith('http'))
      return defaultMapImageUrl(pageCover, postInfo);
  }
}
