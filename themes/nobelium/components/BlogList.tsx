import BLOG from 'blog.config';
import BlogListPage from './BlogListPage';
import BlogListScroll from './BlogListScroll';

export default function BlogList() {
  return BLOG.POST_LIST_STYLE === 'page' ? <BlogListPage /> : <BlogListScroll />;
}