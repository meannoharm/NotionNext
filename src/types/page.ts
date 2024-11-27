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

export type HomeIndexProps = DataBaseForProps &
 {
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
export type CategoryPageProps = DataBaseForProps & {
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
export type TagPageProps = DataBaseForProps & {
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
export type SearchPageProps = DataBaseForProps & {
  posts: Page[];
  resultCount: number;
  page: number;
  keyword: string;
};
export type ArticleProps = DataBaseForProps & {
  post: Page | null;
};

export type ThemeProps<T> = Partial<T & PageMetaProps>;

export type ThemeHomeProps =  {
    posts: Page[];
  };
export type ThemePageNotFoundProps = PageNotFoundIndexProps;
export type ThemeArchiveProps = ArchiveIndexProps;
export type ThemePageProps = PageIndexProps;
export type ThemeCategoryProps = CategoryIndexProps;
export type ThemeCategoryDetailProps = CategoryDetailProps;
export type ThemeCategoryPageProps = CategoryPageProps;
export type ThemeTagProps = TagIndexProps;
export type ThemeTagDetailProps = TagDetailProps;
export type ThemeTagPageProps = TagPageProps;
export type ThemeSearchProps = SearchIndexProps 
export type ThemeSearchDetailProps = SearchDetailProps;
export type ThemeSearchPageProps = SearchPageProps;
export type ThemeArticleProps = ArticleProps  & {
    isLock: boolean;
    validPassword: (passInput: string) => boolean;
  };
