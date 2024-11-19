import type {
  Block,
  BlockMap,
  Collection,
  CollectionPropertySchemaMap,
  CollectionQueryResult,
  CollectionViewMap,
  ExtendedRecordMap,
  FormattedDate,
  ID,
  BlockType,
} from 'notion-types';
import { Config } from './config';

export type * from 'notion-types';

export interface Page {
  id: string;
  title: string;
  type?: PagePropertiesType;
  status?: PagePropertiesStatus;
  category?: string;
  publishDate: number;
  lastEditedDate: number;
  pageIcon: string;
  pageCover: string;
  pageCoverThumbnail: string;
  content: string[];
  blockMap?: ExtendedRecordMap;
  date: FormattedDate;
  icon: string;
  tags: string[];
  summary: string;
  slug?: string;
  results?: string[];
  password?: string;
  toc?: TableOfContentsEntry[];
}

export enum PagePropertiesType {
  Post = 'Post',
  Page = 'Page',
  Notice = 'Notice',
  Config = 'Config',
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

export interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface Site {
  notice: Page | null;
  config: Config;
  siteInfo: SiteInfo;
  allPages: Page[];
  collection: Collection;
  collectionQuery: {
    [collectionId: string]: {
      [collectionViewId: string]: CollectionQueryResult;
    };
  };
  collectionId: string | null;
  collectionView: CollectionViewMap;
  viewIds: string[];
  block: Block;
  blockMap: BlockMap;
  schema: CollectionPropertySchemaMap;
  tagOptions: Tag[];
  categoryOptions: Category[];
  customNav: CustomNav[];
  postCount: number;
  publishedPosts: Page[];
  pageIds: string[];
  latestPosts: Page[];
}

// property description and cover are not included in the original Collection type, but it definitely return these property.
// so use this interface to patch.
export interface PatchedCollection extends Collection {
  description: [[string]];
  cover: string;
}

export interface TableOfContentsEntry {
  id: ID;
  type: BlockType;
  text: string;
  indentLevel: number;
}
