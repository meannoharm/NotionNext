import type {
  Category,
  CollectionPropertySchemaMap,
  Page,
} from '@/types/notion';
import BLOG from 'blog.config';

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns {Category[]}
 */

/**
 * 获取所有文章的分类
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
export function getCategories(
  publishedPosts: Page[],
  schemaMap: CollectionPropertySchemaMap,
  sliceCount = 0,
): Category[] {
  if (!schemaMap) return [];
  const categorySchema = Object.values(schemaMap).find(
    (e) => e.name === BLOG.NOTION_PROPERTY_NAME.category,
  );
  const categoryOptions = categorySchema?.options || [];

  // 计数
  const countMap: { [key: string]: number } = {};
  publishedPosts.forEach(({ category }) => {
    if (!category) return;
    if (category in countMap) {
      countMap[category]++;
    } else {
      countMap[category] = 1;
    }
  });
  const list: Category[] = [];
  for (const categoryOption of categoryOptions) {
    const count = countMap[categoryOption.value];
    if (count) {
      list.push({
        id: categoryOption.id,
        name: categoryOption.value,
        color: categoryOption.color,
        count,
      });
    }
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount);
  } else {
    return list;
  }
}
