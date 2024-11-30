import type { ExtendedRecordMap, Page } from '@/types/notion';

// search in page content
export default function getPageContentText(
  post: Page,
  blockMap: ExtendedRecordMap,
) {
  const contentList: string[] = [];
  if (blockMap && !post.password) {
    Object.values(blockMap.block).forEach((block) => {
      const properties = block.value?.properties;
      if (properties?.title) {
        extractText(properties.title, contentList);
      }
      if (properties?.caption) {
        extractText(properties.caption, contentList);
      }
    });
  }
  return contentList;
}

function extractText(source: any, target: string[]): void {
  if (!source) return;

  const text = extractNestedText(source);
  if (text && text !== 'Untitled') {
    target.push(text);
  }
}

/**
 * 递归获取层层嵌套的数组
 * @param {*} textArray
 * @returns
 */
function extractNestedText(input: any): string {
  if (Array.isArray(input)) {
    return input.reduce((acc, item) => acc + extractNestedText(item), '');
  }
  return typeof input === 'string' ? input : '';
}