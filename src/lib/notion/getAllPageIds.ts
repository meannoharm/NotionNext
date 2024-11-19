import type { CollectionQueryResult, CollectionViewMap } from '@/types/notion';

type Query = {
  [collectionId: string]: {
    [collectionViewId: string]: CollectionQueryResult;
  };
};

export default function getAllPageIds(
  collectionId: string | null,
  collectionQuery: Query,
  collectionView: CollectionViewMap,
  viewIds: string[],
) {
  if (!collectionQuery && !collectionView) {
    return [];
  }

  // 优先按照第一个视图排序
  let pageIds: string[] = [];
  if (viewIds && viewIds.length > 0 && collectionId) {
    const ids =
      collectionQuery[collectionId][viewIds[0]]?.collection_group_results
        ?.blockIds || [];
    for (const id of ids) {
      pageIds.push(id);
    }
  }

  // 否则按照数据库原始排序
  if (pageIds.length === 0 && collectionQuery && collectionId) {
    const pageSet = new Set<string>();
    Object.values(collectionQuery[collectionId]).forEach((view) => {
      view?.blockIds?.forEach((id) => pageSet.add(id)); // group视图
      view?.collection_group_results?.blockIds?.forEach((id) =>
        pageSet.add(id),
      ); // table视图
    });
    pageIds = [...pageSet];
  }

  return pageIds;
}
