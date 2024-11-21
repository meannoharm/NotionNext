import { getPostBlocks } from './getPostBlocks';
import getPageIds from './getPageIds';
import { getTextContent } from 'notion-utils';

import type { Config, Decoration, Page } from '@/types';

// get config from notion page
const getConfig = async (configPage?: Page): Promise<Config> => {
  if (!configPage) {
    return {} as Config;
  }
  const configPageId = configPage.id;
  const configRecordMap = await getPostBlocks(configPageId, 'get-config');
  const configBlockMap = configRecordMap.block;
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

  const collectionId = configBlock.collection_id as string;
  const { schema } = configRecordMap.collection[collectionId].value;

  const [configIds] = getPageIds(
    collectionId,
    configRecordMap.collection_query,
    configRecordMap.collection_view,
    configBlock.view_ids,
  );

  const config: Config = {};

  configIds.forEach((id) => {
    const { properties } = configBlockMap[id].value;
    const tempConfigItem = {
      enable: false,
      name: '',
      value: '',
      type: '',
    };
    Object.entries<Decoration[]>(properties).forEach(([key, value]) => {
      const { name, type } = schema[key];
      const content = getTextContent(value);
      if (type === 'checkbox' && name === 'enable') {
        tempConfigItem[name] = content === 'Yes';
      } else if (name === 'name' || name === 'value' || name === 'type') {
        tempConfigItem[name] = content;
      }
    });
    const { enable, name, value: rawValue, type } = tempConfigItem;

    // Only process selected configurations.
    if (enable) {
      let value: any;

      switch (type) {
        case 'String':
          value = rawValue;
          break;

        case 'Boolean':
          value = rawValue.toLowerCase() === 'true';
          break;

        case 'Number':
          value = parseFloat(rawValue);
          if (isNaN(value)) {
            console.warn(`Invalid number for ${name}: ${rawValue}`);
          }
          break;

        case 'JSON':
          try {
            value = JSON.parse(rawValue);
          } catch (err) {
            console.error(`Invalid JSON for ${name}: ${rawValue}`, err);
          }
          break;

        default:
          console.warn(`Unsupported type for ${name}: ${type} in Config page`);
      }
      config[name] = value;
    }
  });

  return config;
};

export default getConfig;
