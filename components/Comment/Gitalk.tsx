import { useEffect } from 'react';
import 'gitalk/dist/gitalk.css';
import Gitalk from 'gitalk';
import { useConfigStore } from 'providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

import type { Page } from '@/types/notion';

/**
 * @see https://gitalk.github.io/
 */
const GitalkComponent = ({ post }: { post: Page }) => {
  const {
    GITALK_CLIENT_ID,
    GITALK_CLIENT_SECRET,
    GITALK_REPO,
    GITALK_OWNER,
    GITALK_ADMIN,
    GITALK_DISTRACTION_FREE_MODE,
  } = useConfigStore(
    useShallow((state) => ({
      GITALK_CLIENT_ID: state.GITALK_CLIENT_ID,
      GITALK_CLIENT_SECRET: state.GITALK_CLIENT_SECRET,
      GITALK_REPO: state.GITALK_REPO,
      GITALK_OWNER: state.GITALK_OWNER,
      GITALK_ADMIN: state.GITALK_ADMIN,
      GITALK_DISTRACTION_FREE_MODE: state.GITALK_DISTRACTION_FREE_MODE,
    })),
  );

  useEffect(() => {
    const gitalk = new Gitalk({
      clientID: GITALK_CLIENT_ID,
      clientSecret: GITALK_CLIENT_SECRET,
      repo: GITALK_REPO,
      owner: GITALK_OWNER,
      admin: GITALK_ADMIN,
      id: post.id, // Ensure uniqueness and length less than 50
      distractionFreeMode: GITALK_DISTRACTION_FREE_MODE,
    });

    gitalk.render('gitalk-container');
  }, [
    GITALK_ADMIN,
    GITALK_CLIENT_ID,
    GITALK_CLIENT_SECRET,
    GITALK_DISTRACTION_FREE_MODE,
    GITALK_OWNER,
    GITALK_REPO,
    post.id,
  ]);

  return <div id="gitalk-container"></div>;
};

export default GitalkComponent;
