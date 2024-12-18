import BlogPost from '@notion-next-base-theme/nobelium/src/components/BlogPost';

import type { FC } from 'react';
import type { Archive } from '@/types';

export interface BlogArchiveItemProps {
  archiveTitle: keyof Archive;
  archivePosts: Archive;
}

/**
 * 归档分组文章
 * @param {*} param0
 * @returns
 */
const BlogArchiveItem: FC<BlogArchiveItemProps> = ({
  archiveTitle,
  archivePosts,
}) => {
  return (
    <div key={archiveTitle}>
      <div id={archiveTitle} className="pb-4 pt-16 text-xl dark:text-gray-300">
        {archiveTitle}
      </div>
      <div>
        {archivePosts[archiveTitle].map((post) => (
          <BlogPost key={post.id} post={post} isShowSummary={false} />
        ))}
      </div>
    </div>
  );
};

export default BlogArchiveItem;
