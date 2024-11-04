import { DataBaseInfo, PageInfo } from '@/lib/notion/types';

export type PageMeta = {
  title: string;
  description: string;
  image: string;
  slug: string;
  type: string;
  publishDay?: string;
  category?: string;
  tags?: string;
};

export type DataBaseForProps = Omit<DataBaseInfo, 'allPages'>;

export type PageMetaProps = {
  pageMeta: PageMeta;
};

export type ThemeBaseProps = DataBaseForProps & PageMetaProps;

export type ArchiveIndexProps = DataBaseForProps & {
  posts: PageInfo[];
  archivePosts: Record<string, PageInfo[]>;
};
export type CategoryIndexProps = DataBaseForProps;
export type CategoryDetailProps = DataBaseForProps & {
  category: string;
  posts: PageInfo[];
  postCount: number;
};
export type CategoryPageProps = DataBaseForProps & {
  category: string;
};
export type HomeIndexProps = DataBaseForProps &
  PageMetaProps & {
    posts: PageInfo[];
  };
export type PageNotFoundIndexProps = DataBaseForProps;
export type PageIndexProps = DataBaseForProps & {
  posts: PageInfo[];
  page: number;
};

export type ThemeArchiveProps = ArchiveIndexProps & PageMetaProps;
export type ThemeCategoryProps = CategoryIndexProps & PageMetaProps;
export type ThemeCategoryDetailProps = CategoryDetailProps & PageMetaProps;
export type ThemeCategoryPageProps = CategoryPageProps & PageMetaProps;
export type ThemeHomeProps = HomeIndexProps;
export type ThemePageNotFoundProps = PageNotFoundIndexProps & PageMetaProps;
export type ThemePageProps = PageIndexProps & PageMetaProps;
