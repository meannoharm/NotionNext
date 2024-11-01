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
export type HomeIndexProps = DataBaseForProps &
  PageMetaProps & {
    posts: PageInfo[];
  };
export type PageNotFoundIndexProps = DataBaseForProps;

export type ArchiveProps = PageMetaProps & ArchiveIndexProps;
export type CategoryProps = PageMetaProps & CategoryIndexProps;
export type HomeProps = HomeIndexProps;
export type PageNotFoundProps = PageNotFoundIndexProps & PageMetaProps;
