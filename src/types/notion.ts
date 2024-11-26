import type {
  Block,
  Collection,
  ExtendedRecordMap,
  ID,
  BlockType,
} from 'notion-types';
import { SiteConfig } from './config';

export type * from 'notion-types';

export interface Page {
  id: string;
  type: PageType | null;
  title: string;
  status: PageStatus | null;
  category: string;
  icon: string;
  date: number;
  lastEditedDate: number;
  pageIcon: string;
  pageCover: string;
  pageCoverThumbnail: string;
  content: string[];
  tags: string[];
  summary: string;
  slug: string;
  password?: string;
  blockMap?: ExtendedRecordMap;
  results?: string[];
  toc?: TableOfContentsEntry[];
  // for subPage
  parentId?: string | null;
  childrenIds?: string[] | null;
}

export enum PagePropertyName {
  Type = 'type',
  Title = 'title',
  Summary = 'summary',
  Status = 'status',
  Category = 'category',
  Tags = 'tags',
  Slug = 'slug',
  Date = 'date',
  Password = 'password',
  Icon = 'icon',
}

export enum PageType {
  Post = 'Post',
  Page = 'Page',
  Notice = 'Notice',
  Config = 'Config',
  Link = 'Link',
  Menu = 'Menu',
}

export enum PageStatus {
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

export interface Nav {
  id: string;
  icon: string;
  to: string;
  show: boolean;
  title: string;
  subMenus?: Nav[];
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
  id: string;
  notice: Page | null;
  siteInfo: SiteInfo;
  allPages: Page[];
  block: Block;
  tagOptions: Tag[];
  categoryOptions: Category[];
  navList: Nav[];
  publishedPosts: Page[];
  latestPosts: Page[];
  config: SiteConfig;
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

export interface ExtendedTweetRecordMap extends ExtendedRecordMap {
  tweets: Record<string, any>;
}
