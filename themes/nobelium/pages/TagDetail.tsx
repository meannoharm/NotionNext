import { useSiteStore } from 'providers/siteProvider';
import LayoutBase from '../layout/LayoutBase';
import BlogList from '../components/BlogList';
import TagList from '../components/TagList';

const TagDetail = () => {
  const tag = useSiteStore((state) => state.tag);

  return (
    <LayoutBase>
      <TagList />
      <div className="mt-6 text-3xl font-bold text-black dark:text-white">
        {tag}
      </div>
      <BlogList />
    </LayoutBase>
  );
};

export default TagDetail;
