// import { getDataFromCache } from '../cache/cacheManager';
import getPageContentText from './getPageContentText';
import { getPostBlocks } from './getPostBlocks';

import type { Page } from '@/types/notion';
/**
 * 在内存缓存中进行全文索引
 * @param {*} posts
 * @param keyword 关键词
 * @returns
 */
export default async function getSearchResult(posts: Page[], keyword: string) {
  if (!keyword) return [];

  const lowerKeyword = keyword.toLowerCase().trim();
  const filterPosts: Page[] = [];

  for (const post of posts) {
    const pageBlock = await getPostBlocks(
      post.id,
      `get_research_results_${post.id}`,
    );
    const tagContent = post?.tags?.join(' ') || '';
    const categoryContent = post?.category || '';

    const articleInfo = (
      post.title +
      post.summary +
      tagContent +
      categoryContent
    ).toLowerCase();

    post.results = [];
    let hit = articleInfo.includes(lowerKeyword);
    let hitCount = 0;

    const contentList = pageBlock ? getPageContentText(post, pageBlock) : [];

    for (const content of contentList) {
      if (content.toLowerCase().includes(lowerKeyword) && hitCount < 3) {
        hit = true;
        hitCount += 1;
        post.results.push(content);
      } 
    }

    if (hit) {
      filterPosts.push(post);
    }
  }

  return filterPosts;
}
