import type { CategoryInfo, PageInfo, SelectOption } from '@/types/notion';

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns {CategoryInfo[]}
 */

/**
 * 获取所有文章的分类
 * @param allPosts
 * @returns {Promise<{}|*[]>}
 */
export function getAllCategories(
  publishedPosts: PageInfo[],
  categoryOptions: SelectOption[],
  sliceCount = 0,
): CategoryInfo[] {
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
  const list: CategoryInfo[] = [];
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
