import type { ExtendedRecordMap, Page } from '@/types/notion';

export default function getPageContentText(
  post: Page,
  blockMap: ExtendedRecordMap,
) {
  let indexContent: string[] = [];
  if (blockMap && !post.password) {
      Object.values(blockMap.block).forEach((block) => {
      const properties = block.value?.properties;
      indexContent = extractTextContent(indexContent, properties.title);
      indexContent = extractTextContent(indexContent, properties.caption);
    });
  }
  return indexContent;
}

function extractTextContent(
  sourceText: string[],
  target: any,
): string[] {
  if (!target) return sourceText;
  const text = typeof target === 'object' ? getTextContent(target) : target;
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