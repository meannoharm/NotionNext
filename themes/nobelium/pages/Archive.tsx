import LayoutBase from '../layout/LayoutBase';
import BlogArchiveItem from '../components/BlogArchiveItem';
import { ContextWrapper } from '../providers';

import type { FC } from 'react';
import type { ThemeArchiveProps } from '@/pages/types';

/**
 * 归档
 * @param {*} props
 * @returns
 */
const Archive: FC<ThemeArchiveProps> = (props) => {
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

export default ContextWrapper(Archive);
