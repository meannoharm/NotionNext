import dynamic from 'next/dynamic';

const PageNotFound = dynamic(() => import('./pages/PageNotFound'));
const Archive = dynamic(() => import('./pages/archive'));
const Category = dynamic(() => import('./pages/Category'));
const CategoryDetail = dynamic(() => import('./pages/CategoryDetail'));
const Home = dynamic(() => import('./pages/Home'));
const PostList = dynamic(() => import('./pages/PostList'));
const Search = dynamic(() => import('./pages/Search'));
const SearchDetail = dynamic(() => import('./pages/SearchDetail'));
const Tag = dynamic(() => import('./pages/Tag'));
const TagDetail = dynamic(() => import('./pages/TagDetail'));
const Post = dynamic(() => import('./pages/Post'));

const Nobelium = {
  Home,
  Page: PostList,
  Archive,
  Category,
  CategoryDetail,
  CategoryDetailPage: CategoryDetail,
  Tag,
  TagDetail,
  TagDetailPage: TagDetail,
  Search,
  SearchDetail,
  SearchDetailPage: SearchDetail,
  Article: Post,
  PageNotFound,
};

export default Nobelium;
