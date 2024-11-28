import BLOG from 'blog.config';
import { useRouter } from 'next/router';
import ShareButtons from './ShareButtons';

import type { Page } from '@/types';

const ShareBar = ({ post }: { post: Page }) => {
  const router = useRouter();

  if (
    !JSON.parse(BLOG.POST_SHARE_BAR_ENABLE) ||
    !post ||
    post?.type !== 'Post'
  ) {
    return null;
  }

  const shareUrl = BLOG.LINK + router.asPath;

  return (
    <div className="m-1 overflow-x-auto">
      <div className="flex w-full md:justify-end">
        <ShareButtons
          shareUrl={shareUrl}
          title={post.title}
          image={post.pageCover}
          body={
            post?.title +
            ' | ' +
            BLOG.TITLE +
            ' ' +
            shareUrl +
            ' ' +
            post?.summary
          }
        />
      </div>
    </div>
  );
};
export default ShareBar;
