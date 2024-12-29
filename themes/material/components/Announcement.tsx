import dynamic from 'next/dynamic';
import Box from '@mui/material/Box';

import type { FC } from 'react';
import { useSiteStore } from 'providers/siteProvider';

const NotionPage = dynamic(() => import('components/NotionPage'));

const Announcement: FC = () => {
  const notice = useSiteStore((state) => state.notice);

  if (notice && notice?.blockMap) {
    return (
      <Box>
        <NotionPage post={notice} className="text-center" />
      </Box>
    );
  } else {
    return null;
  }
};

export default Announcement;
