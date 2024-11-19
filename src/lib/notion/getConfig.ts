import { Page } from '@/types';
import { getPostBlocks } from './getPostBlocks';

// get config from notion page
const getConfig = async (configPage?: Page) => {
  if (!configPage) {
    return {};
  }
  const configPageId = configPage.id;
  const pageRecordMap = await getPostBlocks(configPageId, 'config-table');
  // content is list block id in config page
  const { content } = pageRecordMap.block[configPageId].value;

  if (!content) {
    return {};
  }

  const configTableId = content.find((contentId) => {
    return pageRecordMap.block[contentId].value.type === 'collection_view';
  });

  if (!configTableId) {
    return {};
  }

  const configDatabaseBlock = pageRecordMap.block[configTableId].value;
  console.log(configDatabaseBlock);

  return {};
};

export default getConfig;
