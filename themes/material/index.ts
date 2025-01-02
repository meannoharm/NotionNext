import dynamic from 'next/dynamic';

export const Home = () => dynamic(import('./pages/Home'));
export const Article = () => dynamic(import('./pages/Article'));
export const Category = () => dynamic(import('./pages/Category'));
export const CategoryDetail = () => dynamic(import('./pages/CategoryDetail'));
export const CategoryDetailPage = () =>
  dynamic(import('./pages/CategoryDetail'));
export const Tag = () => dynamic(import('./pages/Tag'));
export const TagDetail = () => dynamic(import('./pages/TagDetail'));
export const TagDetailPage = () => dynamic(import('./pages/TagDetail'));
export const Archive = () => dynamic(import('./pages/Archive'));
