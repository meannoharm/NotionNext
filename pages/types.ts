import { DataBaseInfo, PageInfo } from '@/lib/notion/types';

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

export type DataBaseForProps = Omit<DataBaseInfo, 'allPages'>;

export type PageMetaProps = {
  pageMeta: PageMeta;
};

export type ThemeBaseProps = DataBaseForProps & PageMetaProps;

export type HomeIndexProps = DataBaseForProps &
  PageMetaProps & {
    posts: PageInfo[];
  };
export type PageNotFoundIndexProps = DataBaseForProps;
export type ArchiveIndexProps = DataBaseForProps & {
  posts: PageInfo[];
  archivePosts: Record<string, PageInfo[]>;
};
export type PageIndexProps = DataBaseForProps & {
  posts: PageInfo[];
  page: number;
};
export type CategoryIndexProps = DataBaseForProps;
export type CategoryDetailProps = DataBaseForProps & {
  category: string;
  posts: PageInfo[];
  postCount: number;
};
export type CategoryPageProps = DataBaseForProps & {
  postCount: number;
  page: number;
  category: string;
};
export type TagIndexProps = DataBaseForProps;
export type TagDetailProps = DataBaseForProps & {
  postCount: number;
  tag: string;
  posts: PageInfo[];
};
export type TagPageProps = DataBaseForProps & {
  postCount: number;
  page: number;
  tag: string;
};
export type SearchIndexProps = DataBaseForProps & {
  posts: PageInfo[];
};
export type SearchDetailProps = DataBaseForProps & {
  postCount: number;
  keyword: string;
  posts: PageInfo[];
};
export type SearchPageProps = DataBaseForProps & {
  posts: PageInfo[];
  postCount: number;
  page: number;
  keyword: string;
};
export type SlugIndexProps = DataBaseForProps & {
  post: PageInfo | null;
  prev: PageInfo | null;
  next: PageInfo | null;
  recommendPosts: PageInfo[];
};

export type ThemeProps<T> = Partial<T & PageMetaProps>;

export type ThemeHomeProps = HomeIndexProps;
export type ThemePageNotFoundProps = PageNotFoundIndexProps & PageMetaProps;
export type ThemeArchiveProps = ArchiveIndexProps & PageMetaProps;
export type ThemePageProps = PageIndexProps & PageMetaProps;
export type ThemeCategoryProps = CategoryIndexProps & PageMetaProps;
export type ThemeCategoryDetailProps = CategoryDetailProps & PageMetaProps;
export type ThemeCategoryPageProps = CategoryPageProps & PageMetaProps;
export type ThemeTagIndexProps = TagIndexProps & PageMetaProps;
export type ThemeTagDetailProps = TagDetailProps & PageMetaProps;
export type ThemeTagPageProps = TagPageProps & PageMetaProps;
export type ThemeSearchIndexProps = SearchIndexProps & PageMetaProps;
export type ThemeSearchDetailProps = SearchDetailProps & PageMetaProps;
export type ThemeSearchPageProps = SearchPageProps & PageMetaProps;
export type ThemeSlugIndexProps = SlugIndexProps &
  PageMetaProps & {
    isLock: boolean;
    validPassword: (passInput: string) => boolean;
  };
