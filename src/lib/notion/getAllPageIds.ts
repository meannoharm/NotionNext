import type { CollectionQueryResult, CollectionViewMap } from './types';

type Query = {
  [collectionId: string]: {
    [collectionViewId: string]: CollectionQueryResult;
  };
};

export default function getAllPageIds(
  collectionQuery: Query,
  collectionId: string | null,
  collectionView: CollectionViewMap,
  viewIds: string[],
) {
  if (!collectionQuery && !collectionView) {
    return [];
  }
  // 优先按照第一个视图排序
  let pageIds: string[] = [];
  try {
    if (viewIds && viewIds.length > 0 && collectionId) {
      const ids =
        collectionQuery[collectionId][viewIds[0]]?.collection_group_results
          ?.blockIds || [];
      for (const id of ids) {
        pageIds.push(id);
      }
    }
  } catch (error) {
    console.log(error);
  }

  // 否则按照数据库原始排序
  if (
    pageIds.length === 0 &&
    collectionQuery &&
    Object.values(collectionQuery).length > 0 &&
    collectionId
  ) {
    const pageSet = new Set<string>();
    Object.values(collectionQuery[collectionId]).forEach((view) => {
      view?.blockIds?.forEach((id) => pageSet.add(id)); // group视图
      view?.collection_group_results?.blockIds?.forEach((id) =>
        pageSet.add(id),
      ); // table视图
    });
    pageIds = [...pageSet];
    // console.log('PageIds: 从collectionQuery获取', collectionQuery, pageIds.length)
  }
  return pageIds;
}
