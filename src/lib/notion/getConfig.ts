import { getPostBlocks } from './getPostBlocks';
import getAllPageIds from './getAllPageIds';
import { getPageProperty } from 'notion-utils';

import type { Config, RawPage } from '@/types';

// get config from notion page
const getConfig = async (configPage?: RawPage): Promise<Config> => {
  if (!configPage) {
    return {} as Config;
  }
  const configPageId = configPage.id;
  const pageRecordMap = await getPostBlocks(configPageId, 'config');
  const configBlockMap = pageRecordMap.block;
  const { content } = configBlockMap[configPageId].value;

  if (!content) {
    return {} as Config;
  }

  const configTableId = content.find((contentId) => {
    return configBlockMap[contentId].value.type === 'collection_view';
  });

  if (!configTableId) {
    return {} as Config;
  }

  const configBlock = configBlockMap[configTableId].value;

  if (
    configBlock.type !== 'collection_view_page' &&
    configBlock.type !== 'collection_view'
  ) {
    console.error(`pageId "${configPageId}" is not a database`);
    throw Error(`pageId "${configPageId}" is not a database`);
    // return EmptyData(pageUuid);
  }

  const pageIds = getAllPageIds(
    configBlock.collection_id || null,
    pageRecordMap.collection_query,
    pageRecordMap.collection_view,
    configBlock.view_ids,
  );

  const config: Config = {};

  pageIds.forEach((id) => {
    const enable = getPageProperty(
      'enable',
      configBlockMap[id].value,
      pageRecordMap,
    ) as boolean;
    const name = getPageProperty(
      'name',
      configBlockMap[id].value,
      pageRecordMap,
    ) as string;
    const rawValue = getPageProperty(
      'value',
      configBlockMap[id].value,
      pageRecordMap,
    ) as string;
    const type = getPageProperty(
      'type',
      configBlockMap[id].value,
      pageRecordMap,
    ) as string;

    if (enable) {
      let value: any;

      switch (type) {
        case 'String':
          value = rawValue; // 字符串无需转换
          break;

        case 'Boolean':
          value = rawValue.toLowerCase() === 'true'; // 转换为布尔值
          break;

        case 'Number':
          value = parseFloat(rawValue); // 转换为数字
          if (isNaN(value)) {
            console.warn(`Invalid number for ${name}: ${rawValue}`);
          }
          break;

        case 'JSON':
          try {
            value = JSON.parse(rawValue); // 尝试解析为 JSON
          } catch (err) {
            console.error(`Invalid JSON for ${name}: ${rawValue}`, err);
          }
          break;

        default:
          console.warn(`Unsupported type for ${name}: ${type}`);
      }
      config[name] = value;
    }
  });

  return config;
};

export default getConfig;
