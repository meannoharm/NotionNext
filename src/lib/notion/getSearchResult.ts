import { Page, Site } from "@/types/notion";
import { getDataFromCache } from "../cache/cacheManager";

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
    const page = await getDataFromCache<Site>(`page_block_${post.id}`, true);
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

    const indexContent = page ? getPageContentText(post, page) : [];
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

function getPageContentText(post: Page, dataBaseInfo: Site) {
  let indexContent: string[] = [];
  if (dataBaseInfo && dataBaseInfo?.block && !post.password) {
    Object.values(dataBaseInfo.block).forEach((block) => {
      const properties = block.value?.properties;
      indexContent = extractTextContent(indexContent, properties, 'title');
      indexContent = extractTextContent(indexContent, properties, 'caption');
    });
  }
  return indexContent;
}

function extractTextContent(
  sourceText: string[],
  targetObj: any,
  key: string,
): string[] {
  if (!targetObj) return sourceText;
  const textArray = targetObj[key];
  const text =
    typeof textArray === 'object' ? getTextContent(textArray) : textArray;
  return text && text !== 'Untitled' ? sourceText.concat(text) : sourceText;
}

/**
 * 递归获取层层嵌套的数组
 * @param {*} textArray
 * @returns
 */
function getTextContent(textArray: any): string {
  return Array.isArray(textArray)
    ? textArray.reduce((acc, item) => acc + getTextContent(item), '')
    : typeof textArray === 'string'
      ? textArray
      : '';
}