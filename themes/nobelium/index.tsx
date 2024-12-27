import dynamic from 'next/dynamic';

export const Home = dynamic(() => import('./pages/Home'));
export const PageNotFound = dynamic(() => import('./pages/PageNotFound'));
export const Archive = dynamic(() => import('./pages/archive'));
export const Category = dynamic(() => import('./pages/Category'));
export const CategoryDetail = dynamic(() => import('./pages/CategoryDetail'));
export const PostList = dynamic(() => import('./pages/PostList'));
export const Search = dynamic(() => import('./pages/Search'));
export const SearchDetail = dynamic(() => import('./pages/SearchDetail'));
export const Tag = dynamic(() => import('./pages/Tag'));
export const TagDetail = dynamic(() => import('./pages/TagDetail'));
export const Post = dynamic(() => import('./pages/Post'));
export const Page = PostList;
export const CategoryDetailPage = CategoryDetail;
export const TagDetailPage = TagDetail;
export const SearchDetailPage = SearchDetail;
export const Article = Post;
