import BlogListPage from './BlogListPage';
import BlogListScroll from './BlogListScroll';
import { useConfigStore } from '@/providers/configProvider';

export default function BlogList() {
  const POST_LIST_STYLE = useConfigStore((state) => state.POST_LIST_STYLE);
  return POST_LIST_STYLE === 'page' ? <BlogListPage /> : <BlogListScroll />;
}
