import BLOG from '@/blog.config';
import { idToUuid } from 'notion-utils';
import { getPostBlocks } from './getPostBlocks';
import { defaultMapImageUrl } from 'react-notion-x';
import dayjs from 'dayjs';

import {
  Block,
  PageInfo,
  PagePropertiesType,
  PagePropertiesStatus,
} from './types';

/**
 * formate from postBlock to pageInfo
 * @param {*} pageId
 * @returns
 */
export async function getPageInfoOfPostPage(pageId: string, from: string) {
  const blockMap = await getPostBlocks(pageId, from);
  if (!blockMap) {
    return;
  }

  const postInfo = blockMap?.block?.[idToUuid(pageId)].value;

  return {
    id: pageId,
    type: PagePropertiesType.Post,
    category: '',
    tags: [],
    title: postInfo?.properties?.title?.[0],
    status: PagePropertiesStatus.Published,
    pageCover: getPageCover(postInfo),
    date: {
      type: 'date',
      start_date: dayjs(postInfo.last_edited_time).format('yyyy-MM-dd'),
    },
    blockMap,
    publishDate: dayjs(postInfo.created_time).valueOf(),
    lastEditedDate: dayjs(postInfo.last_edited_time).valueOf(),
    pageIcon: '',
    pageCoverThumbnail: '',
    content: [],
    icon: '',
    summary: '',
    slug: '',
  } as PageInfo;
}

function getPageCover(postInfo: Block) {
  const pageCover = postInfo.format?.page_cover;
  if (pageCover) {
    if (pageCover.startsWith('/')) return BLOG.NOTION_HOST + pageCover;
    if (pageCover.startsWith('http'))
      return defaultMapImageUrl(pageCover, postInfo);
  }
}
