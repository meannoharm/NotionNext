import { getDataFromCache } from "../cache/cacheManager";
import getPageContentText from "./getPageContentText";

import type { ExtendedRecordMap, Page } from "@/types/notion";
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

  posts.forEach(async (post) => {
    const pageBlock = await getDataFromCache<ExtendedRecordMap>(`page_block_${post.id}`, true);
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

    const indexContent = pageBlock ? getPageContentText(post, pageBlock) : '';
    for (const content of indexContent) {
      if (!content) continue;
      if (content.toLowerCase().includes(lowerKeyword)) {
        hit = true;
        hitCount += 1;
        post.results.push(content);
      } else if ((post.results.length - 1) / (hitCount || 1) < 3) {
        post.results.push(content);
      }
    }

    if (hit) filterPosts.push(post);
  });
  return filterPosts;
}

