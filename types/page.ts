import type { Site, Page, Archive } from './notion';

export type PageMeta = {
  title: string;
  description: string;
  image: string;
  slug: string;
  type: string;
  publishDay?: string;
  category?: string;
  tags?: string[];
};
export type DataBaseForProps = Omit<Site, 'allPages'>;

export type PageMetaProps = {
  pageMeta: PageMeta;
};

export type ThemeBaseProps = DataBaseForProps;

export type HomeIndexProps = DataBaseForProps & {
  posts: Page[];
};
export type PageNotFoundIndexProps = DataBaseForProps;
export type ArchiveIndexProps = DataBaseForProps & {
  archive: Archive;
};
export type PageIndexProps = DataBaseForProps & {
  posts: Page[];
  page: number;
};
export type CategoryIndexProps = DataBaseForProps;
export type CategoryDetailProps = DataBaseForProps & {
  category: string;
  posts: Page[];
  resultCount: number;
};
export type CategoryDetailPageProps = DataBaseForProps & {
  resultCount: number;
  posts: Page[];
  page: number;
  category: string;
};
export type TagIndexProps = DataBaseForProps;
export type TagDetailProps = DataBaseForProps & {
  tag: string;
  posts: Page[];
  resultCount: number;
};
export type TagDetailPageProps = DataBaseForProps & {
  page: number;
  tag: string;
  posts: Page[];
  resultCount: number;
};
export type SearchIndexProps = DataBaseForProps;
export type SearchDetailProps = DataBaseForProps & {
  keyword: string;
  posts: Page[];
  resultCount: number;
};
export type SearchDetailPageProps = DataBaseForProps & {
  posts: Page[];
  resultCount: number;
  page: number;
  keyword: string;
};
export type ArticleProps = DataBaseForProps & {
  post: Page | null;
};
