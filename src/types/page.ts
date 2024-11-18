import type { Site, Page } from './notion';

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
export type ArchivePosts = Record<string, Page[]>;
export type DataBaseForProps = Omit<Site, 'allPages'>;

export type PageMetaProps = {
  pageMeta: PageMeta;
};

export type ThemeBaseProps = DataBaseForProps & PageMetaProps;

export type HomeIndexProps = DataBaseForProps &
  PageMetaProps & {
    posts: Page[];
  };
export type PageNotFoundIndexProps = DataBaseForProps;
export type ArchiveIndexProps = DataBaseForProps & {
  posts: Page[];
  archivePosts: ArchivePosts;
};
export type PageIndexProps = DataBaseForProps & {
  posts: Page[];
  page: number;
};
export type CategoryIndexProps = DataBaseForProps;
export type CategoryDetailProps = DataBaseForProps & {
  category: string;
  posts: Page[];
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
  posts: Page[];
};
export type TagPageProps = DataBaseForProps & {
  postCount: number;
  page: number;
  tag: string;
};
export type SearchIndexProps = DataBaseForProps & {
  posts: Page[];
};
export type SearchDetailProps = DataBaseForProps & {
  postCount: number;
  keyword: string;
  posts: Page[];
};
export type SearchPageProps = DataBaseForProps & {
  posts: Page[];
  postCount: number;
  page: number;
  keyword: string;
};
export type SlugIndexProps = DataBaseForProps & {
  post: Page | null;
  prev: Page | null;
  next: Page | null;
  recommendPosts: Page[];
};
export type PrefixSlugProps = SlugIndexProps;

export type ThemeProps<T> = Partial<T & PageMetaProps>;

export type ThemeHomeProps = HomeIndexProps;
export type ThemePageNotFoundProps = PageNotFoundIndexProps & PageMetaProps;
export type ThemeArchiveProps = ArchiveIndexProps & PageMetaProps;
export type ThemePageProps = PageIndexProps & PageMetaProps;
export type ThemeCategoryProps = CategoryIndexProps & PageMetaProps;
export type ThemeCategoryDetailProps = CategoryDetailProps & PageMetaProps;
export type ThemeCategoryPageProps = CategoryPageProps & PageMetaProps;
export type ThemeTagProps = TagIndexProps & PageMetaProps;
export type ThemeTagDetailProps = TagDetailProps & PageMetaProps;
export type ThemeTagPageProps = TagPageProps & PageMetaProps;
export type ThemeSearchProps = SearchIndexProps &
  PageMetaProps & {
    keyword: string;
  };
export type ThemeSearchDetailProps = SearchDetailProps & PageMetaProps;
export type ThemeSearchPageProps = SearchPageProps & PageMetaProps;
export type ThemePrefixProps = SlugIndexProps &
  PageMetaProps & {
    isLock: boolean;
    validPassword: (passInput: string) => boolean;
  };
export type ThemePrefixSlugProps = ThemePrefixProps;
