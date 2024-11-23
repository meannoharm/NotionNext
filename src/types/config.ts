import BLOG from 'blog.config';

export type SiteConfig = typeof BLOG & {
  [key: string]: any;
};
