import dynamic from 'next/dynamic';

import type { PageInfo } from '@/types';
import type { FC } from 'react';

const NotionPage = dynamic(() => import('@/components/NotionPage'));

export interface AnnouncementProps {
  notice: PageInfo | null;
}

const Announcement: FC<AnnouncementProps> = ({ notice }) => {
  if (notice && notice?.blockMap) {
    return (
      <div>
        <section id="announcement-wrapper" className="mb-10">
          <div id="announcement-content">
            <NotionPage post={notice} className="text-center " />
          </div>
        </section>
      </div>
    );
  } else {
    return null;
  }
};

export default Announcement;
