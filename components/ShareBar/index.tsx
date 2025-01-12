import { useRouter } from 'next/router';
import ShareButtons from './ShareButtons';
import { SITE_URL } from '@/constants';
import { useConfigStore } from 'providers/configProvider';
import { useShallow } from 'zustand/react/shallow';
import { useSiteStore } from 'providers/siteProvider';

import type { Page } from '@/types';

const ShareBar = ({ post }: { post: Page }) => {
  const router = useRouter();
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const { POST_SHARE_BAR_ENABLE } = useConfigStore(
    useShallow((state) => ({
      POST_SHARE_BAR_ENABLE: state.POST_SHARE_BAR_ENABLE,
    })),
  );

  if (!POST_SHARE_BAR_ENABLE || !post || post?.type !== 'Post') {
    return null;
  }

  const shareUrl = SITE_URL + router.asPath;

  return (
    <div className="mt-4 overflow-x-auto">
      <div className="flex w-full md:justify-end">
        <ShareButtons
          shareUrl={shareUrl}
          title={`${post.title} | ${siteInfo.title}`}
          image={post.pageCover}
          body={`${post?.title ?? ''} | ${siteInfo.title} ${shareUrl} ${post?.summary ?? ''}`}
        />
      </div>
    </div>
  );
};
export default ShareBar;
