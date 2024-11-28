import BLOG from 'blog.config';
import { useEffect } from 'react';
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

import type { Page } from '@/types/notion';

/**
 * @see https://gitalk.github.io/
 */
const GitalkComponent = ({ post }: { post: Page }) => {
  useEffect(() => {
    const gitalk = new Gitalk({
      clientID: BLOG.COMMENT_GITALK_CLIENT_ID,
      clientSecret: BLOG.COMMENT_GITALK_CLIENT_SECRET,
      repo: BLOG.COMMENT_GITALK_REPO,
      owner: BLOG.COMMENT_GITALK_OWNER,
      admin: BLOG.COMMENT_GITALK_ADMIN.split(','),
      id: post.id, // Ensure uniqueness and length less than 50
      distractionFreeMode: BLOG.COMMENT_GITALK_DISTRACTION_FREE_MODE,
    });

    gitalk.render('gitalk-container');
  }, []);

  return <div id="gitalk-container"></div>;
};

export default GitalkComponent;
