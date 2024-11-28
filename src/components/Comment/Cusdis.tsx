import BLOG from 'blog.config';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useStyleStore } from '@/providers/styleProvider';

import type { Page } from '@/types/notion';
import Script from 'next/script';

/**
 * @see https://cusdis.com/
 */
const Cusdis = ({ post }: { post: Page }) => {
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const isDarkMode = useStyleStore((state) => state.isDarkMode);
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    renderCusdis();
  }, [isDarkMode]);

  const renderCusdis = () => {
    const render = (window as any).renderCusdis;

    if (render) {
      render(divRef.current);
    }
  };

  return (
    <>
      <div
        ref={divRef}
        id="cusdis_thread"
        lang={language}
        data-host={BLOG.COMMENT_CUSDIS_HOST}
        data-app-id={BLOG.COMMENT_CUSDIS_APP_ID}
        data-page-id={post.id}
        data-page-url={BLOG.LINK + router.asPath}
        data-page-title={post.title}
        data-theme={isDarkMode ? 'dark' : 'light'}
      />
      <Script
        defer
        src={`https://cusdis.com/js/widget/lang/${BLOG.LANG.toLowerCase()}.js`}
        onLoad={renderCusdis}
      />
      <Script src={BLOG.COMMENT_CUSDIS_SCRIPT_SRC} onLoad={renderCusdis} />
    </>
  );
};

export default Cusdis;
