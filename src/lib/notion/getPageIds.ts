import type { CollectionQueryResult, CollectionViewMap } from '@/types/notion';

type Query = {
  [collectionId: string]: {
    [collectionViewId: string]: CollectionQueryResult;
  };
};

export default function getPageIds(
  collectionId: string | null,
  collectionQuery: Query,
  collectionView: CollectionViewMap,
  viewIds: string[],
) {
  if (!collectionId) return [];
  if (!collectionQuery && !collectionView) {
    return [];
  }
  return viewIds.map(
    (viewId) =>
      collectionQuery[collectionId][viewId].collection_group_results
        ?.blockIds || [],
  );
}
