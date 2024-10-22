import type {
  BlockMap,
  Collection,
  CollectionPropertySchemaMap,
  CollectionQueryResult,
  CollectionViewBlock,
  CollectionViewMap,
  CollectionViewPageBlock,
  ExtendedRecordMap,
} from 'notion-types';

export type * from 'notion-types';

export interface PageInfo {
  id: string;
  title: string;
  type?: PagePropertiesType;
  status?: PagePropertiesStatus;
  category?: string;
  publishDate: string;
  latestEditedDate: string;
  pageIcon: string;
  pageCover: string;
  pageCoverThumbnail: string;
  content: string[];

  blockMap?: ExtendedRecordMap;
  date: string;
  icon: string;
  tags: string[];
  summary: string;
  slug: string;
  [key: string]: any;
}

export enum PagePropertiesType {
  Post = 'Post',
  Page = 'Page',
  Notice = 'Notice',
}

export enum PagePropertiesStatus {
  Published = 'Published',
  Invisible = 'Invisible',
  Draft = 'Draft',
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo: string;
}

export interface CustomNav {
  icon: string;
  name: string;
  to: string;
  target: string;
  show: boolean;
}

export interface SiteInfo {
  title: string;
  description: string;
  pageCover: string;
  icon: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface TagInfo {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface DataBaseInfo {
  notice: PageInfo | null;
  siteInfo: SiteInfo;
  allPages: PageInfo[];
  collection: Collection;
  collectionQuery: {
    [collectionId: string]: {
      [collectionViewId: string]: CollectionQueryResult;
    };
  };
  collectionId: string | null;
  collectionView: CollectionViewMap;
  viewIds: string[];
  block: BlockMap;
  schema: CollectionPropertySchemaMap;
  tagOptions: TagInfo[];
  categoryOptions: CategoryInfo[];
  rawMetadata: CollectionViewBlock | CollectionViewPageBlock;
  customNav: CustomNav[];
  postCount: number;
  publishedPosts: PageInfo[];
  pageIds: string[];
  latestPosts: PageInfo[];
}
