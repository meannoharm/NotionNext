import type {
  Block,
  Collection,
  ExtendedRecordMap,
  FormattedDate,
  ID,
  BlockType,
} from 'notion-types';
import { Config } from './config';

export type * from 'notion-types';

export interface RawPage {
  id: string;
  title: string;
  type?: PageType;
  status?: PageStatus;
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

export interface Page extends RawPage {
  type: PageType;
  slug: string;
}

export enum PageType {
  Post = 'Post',
  Page = 'Page',
  SubPage = 'SubPage',
  Notice = 'Notice',
  Config = 'Config',
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
  target: string;
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
  config: Config;
  siteInfo: SiteInfo;
  allPages: Page[];
  block: Block;
  tagOptions: Tag[];
  categoryOptions: Category[];
  navList: Nav[];
  postCount: number;
  publishedPosts: Page[];
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
