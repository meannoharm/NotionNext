import { DataBaseInfo, PageInfo } from '@/lib/notion/types';

export type PageMeta = {
  title: string;
  description: string;
  image: string;
  slug: string;
  type: string;
};

export type BaseThemeProps = DataBaseInfo & {
  pageMeta: PageMeta;
};

export type ArchiveIndexProps = BaseThemeProps & {
  posts: PageInfo[];
  archivePosts: Record<string, PageInfo[]>;
};
