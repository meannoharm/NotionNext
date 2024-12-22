import LayoutBase from '@themes/nobelium/src/layout/LayoutBase';
import BlogArchiveItem from './components/BlogArchiveItem';
import { useSiteStore } from '@/providers/siteProvider';

/**
 * 归档
 * @param {*} props
 * @returns
 */
const Archive = () => {
  const archive = useSiteStore((state) => state.archive);

  return (
    <LayoutBase>
      <div className="mb-10 min-h-screen w-full p-3  pb-20 md:py-12">
        {Object.keys(archive).map((archiveTitle) => (
          <BlogArchiveItem
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archive}
          />
        ))}
      </div>
    </LayoutBase>
  );
};

export default Archive;
