import React, { useEffect } from 'react';
import { init, WalineInstance } from '@waline/client';
import BLOG from 'blog.config';
import '@waline/client/dist/waline.css';

/**
 * @see https://waline.js.org
 */
const Waline = () => {
  const containerRef = React.createRef<HTMLDivElement>();
  const waline = React.useRef<WalineInstance | null>(null);

  useEffect(() => {
    if (!waline.current) {
      waline.current = init({
        el: containerRef.current,
        serverURL: BLOG.COMMENT_WALINE_SERVER_URL,
        lang: BLOG.LANG,
        reaction: true,
        dark: 'html.dark',
        emoji: [
          '//npm.elemecdn.com/@waline/emojis@1.1.0/tieba',
          '//npm.elemecdn.com/@waline/emojis@1.1.0/weibo',
          '//npm.elemecdn.com/@waline/emojis@1.1.0/bilibili',
        ],
      });
    }

    return () => {
      if (waline.current) {
        waline.current.destroy();
        waline.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} />;
};

export default Waline;
