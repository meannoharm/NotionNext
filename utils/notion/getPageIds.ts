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
  const idList = new Set<string>();
  for (const viewId of viewIds) {
    const ids =
      collectionQuery[collectionId][viewId].collection_group_results
        ?.blockIds || [];
    ids.forEach((id) => idList.add(id));
  }
  return Array.from(idList);
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
      return (
        collectionQuery[collectionId][view.value.id].collection_group_results
          ?.blockIds[0] || null
      );
    }
  }
  return null;
};
