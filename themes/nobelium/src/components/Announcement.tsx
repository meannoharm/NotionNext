import dynamic from 'next/dynamic';

import type { FC } from 'react';
import { useSiteStore } from '@/providers/siteProvider';

const NotionPage = dynamic(() => import('@/components/NotionPage'));

const Announcement: FC = () => {
  const notice = useSiteStore((state) => state.notice);

  if (notice && notice?.blockMap) {
    return (
      <div>
        <section id="announcement-wrapper" className="mb-10">
          <div id="announcement-content">
            <NotionPage post={notice} className="text-center" />
          </div>
        </section>
      </div>
    );
  } else {
    return null;
  }
};

export default Announcement;
