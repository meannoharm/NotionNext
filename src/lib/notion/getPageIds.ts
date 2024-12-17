import type { CollectionQueryResult, CollectionViewMap } from '@/types/notion';

export const CONFIG_VIEW_NAME = 'Config';

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
  return viewIds
    .map(
      (viewId) =>
        collectionQuery[collectionId][viewId].collection_group_results
          ?.blockIds || [],
    )
    .flat();
}

export const getConfigPageId = (
  collectionId: string | null,
  collectionQuery: Query,
  collectionView: CollectionViewMap,
) => {
  if (!collectionId || !collectionView) {
    return null;
  }
  for (const view of Object.values(collectionView)) {
    if (view.value.name === CONFIG_VIEW_NAME) {
      return collectionQuery[collectionId][view.value.id].collection_group_results
        ?.blockIds[0];
    }
  }
  return null;
};
