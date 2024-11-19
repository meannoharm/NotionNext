import { RawPage } from '@/types';
import { getPostBlocks } from './getPostBlocks';
import getAllPageIds from './getAllPageIds';

// get config from notion page
const getConfig = async (configPage?: RawPage) => {
  if (!configPage) {
    return {};
  }
  const configPageId = configPage.id;
  const pageRecordMap = await getPostBlocks(configPageId, 'config');
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

  const configBlock = pageRecordMap.block[configTableId].value;

  if (
    configBlock.type !== 'collection_view_page' &&
    configBlock.type !== 'collection_view'
  ) {
    console.error(`pageId "${configPageId}" is not a database`);
    throw Error(`pageId "${configPageId}" is not a database`);
    // return EmptyData(pageUuid);
  }

  const collectionId = configBlock?.collection_id || null;
  const viewIds = configBlock?.view_ids;

  const pageIds = getAllPageIds(
    collectionId,
    pageRecordMap.collection_query,
    pageRecordMap.collection_view,
    viewIds,
  );

  console.log(pageIds);

  return {};
};

export default getConfig;
