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

export type PageMetaProps = {
  pageMeta: PageMeta;
};

export type ThemeBaseProps = DataBaseInfo & PageMetaProps;

export type ArchiveIndexProps = DataBaseInfo & {
  posts: PageInfo[];
  archivePosts: Record<string, PageInfo[]>;
};

export type ArchiveProps = PageMetaProps & ArchiveIndexProps;
