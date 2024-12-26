import React, { useEffect } from 'react';
import { init, WalineInstance } from '@waline/client';
import '@waline/client/dist/waline.css';
import { useTranslation } from 'next-i18next';
import { useConfigStore } from 'providers/configProvider';

/**
 * @see https://waline.js.org
 */
const Waline = () => {
  const containerRef = React.createRef<HTMLDivElement>();
  const waline = React.useRef<WalineInstance | null>(null);
  const {
    i18n: { language },
  } = useTranslation();
  const WALINE_SERVER_URL = useConfigStore((state) => state.WALINE_SERVER_URL);

  useEffect(() => {
    if (!waline.current) {
      waline.current = init({
        el: containerRef.current,
        serverURL: WALINE_SERVER_URL,
        lang: language,
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
  }, [language, WALINE_SERVER_URL]);

  return <div ref={containerRef} />;
};

export default Waline;
