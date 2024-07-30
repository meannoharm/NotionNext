import type { Category, PageProperties, SelectOption } from './types';

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
export function getAllCategories(
  allPages: PageProperties[],
  categoryOptions: SelectOption[],
  sliceCount = 0,
): Category[] {
  const allPosts = allPages?.filter(
    (page) => page.type === 'Post' && page.status === 'Published',
  );
  if (!allPosts || !categoryOptions) {
    return [];
  }
  // 计数
  const categories = allPosts.map((p) => p.category).flat();
  const countMap: { [key: string]: number } = {};
  categories.forEach((category) => {
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
