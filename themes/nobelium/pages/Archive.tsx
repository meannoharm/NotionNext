import LayoutBase from '../layout/LayoutBase';
import BlogArchiveItem from '../components/BlogArchiveItem';

import type { FC } from 'react';

export interface ArchiveProps {}

/**
 * 归档
 * @param {*} props
 * @returns
 */
const Archive: FC<ArchiveProps> = (props) => {
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

export default Archive;
