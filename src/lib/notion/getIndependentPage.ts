import { getPostBlocks } from './getPostBlocks';
import { defaultMapImageUrl } from 'react-notion-x';
import dayjs from 'dayjs';
import { NOTION_HOST } from '@/constants';

import { Block, Page, PageType, PageStatus } from '@/types/notion';

/**
 * formate from postBlock to pageInfo
 * @param {*} pageId
 * @returns
 */
export async function getIndependentPage(pageId: string, from: string) {
  const blockMap = await getPostBlocks(pageId, from);
  if (!blockMap) {
    return;
  }

  const postInfo = blockMap?.block?.[pageId].value;

  return {
    id: pageId,
    type: PageType.Post,
    category: '',
    tags: [],
    title: postInfo?.properties?.title?.[0] || '',
    status: PageStatus.Published,
    pageCover: getPageCover(postInfo) || '',
    blockMap,
    date: dayjs(postInfo.created_time).valueOf(),
    lastEditedDate: dayjs(postInfo.last_edited_time).valueOf(),
    pageIcon: '',
    pageCoverThumbnail: '',
    content: [],
    icon: '',
    summary: '',
    slug: '',
  } as Page;
}

function getPageCover(postInfo: Block) {
  const pageCover = postInfo.format?.page_cover;
  if (pageCover) {
    if (pageCover.startsWith('/')) return NOTION_HOST + pageCover;
    if (pageCover.startsWith('http'))
      return defaultMapImageUrl(pageCover, postInfo);
  }
}
