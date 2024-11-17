import { isIterable } from '../utils';
import type { PageInfo, SelectOption, TagInfo } from '@/types/notion';

/**
 * 获取所有文章的标签
 * @param allPosts
 * @param sliceCount 默认截取数量为12，若为0则返回全部
 * @param tagOptions tags的下拉选项
 * @returns {Promise<{}|*[]>}
 */
export function getAllTags(
  publishedPosts: PageInfo[],
  tagOptions: SelectOption[],
  sliceCount = 0,
): TagInfo[] {
  // 计数
  const tags = publishedPosts?.map((p) => p.tags).flat();
  const countMap: { [key: string]: number } = {};
  tags.forEach((tag) => {
    if (tag in countMap) {
      countMap[tag]++;
    } else {
      countMap[tag] = 1;
    }
  });
  const list: TagInfo[] = [];
  if (isIterable(tagOptions)) {
    tagOptions.forEach((tag) => {
      const count = countMap[tag.value];
      if (count) {
        list.push({ id: tag.id, name: tag.value, color: tag.color, count });
      }
    });
  }

  // 按照数量排序
  // list.sort((a, b) => b.count - a.count)
  if (sliceCount && sliceCount > 0) {
    return list.slice(0, sliceCount);
  } else {
    return list;
  }
}
