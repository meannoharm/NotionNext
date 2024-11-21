import BLOG from 'blog.config';
export type Config = typeof BLOG & {
  [key: string]: any;
};
