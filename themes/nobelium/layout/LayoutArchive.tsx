import LayoutBase from './BaseLayout';
import BlogArchiveItem from '../components/BlogArchiveItem';

/**
 * 归档
 * @param {*} props
 * @returns
 */
const LayoutArchive = (props) => {
  const { archivePosts } = props;
  return (
    <LayoutBase {...props}>
      <div className="mb-10 min-h-screen w-full p-3  pb-20 md:py-12">
        {Object.keys(archivePosts).map((archiveTitle) => (
          <BlogArchiveItem
            key={archiveTitle}
            archiveTitle={archiveTitle}
            archivePosts={archivePosts}
          />
        ))}
      </div>
    </LayoutBase>
  );
};

export default LayoutArchive;
