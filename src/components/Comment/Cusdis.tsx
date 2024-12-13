import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useStyleStore } from '@/providers/styleProvider';
import Script from 'next/script';
import { useShallow } from 'zustand/react/shallow';
import { useConfigStore } from '@/providers/configProvider';
import { SITE_URL } from '@/constants';

import type { Page } from '@/types/notion';

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
  const { CUSDIS_APP_ID, CUSDIS_HOST, CUSDIS_BASE } = useConfigStore(
    useShallow((state) => ({
      CUSDIS_APP_ID: state.CUSDIS_APP_ID,
      CUSDIS_HOST: state.CUSDIS_HOST,
      CUSDIS_BASE: state.CUSDIS_BASE,
    })),
  );

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
        data-host={CUSDIS_HOST}
        data-app-id={CUSDIS_APP_ID}
        data-page-id={post.id}
        data-page-url={`${SITE_URL}${router.asPath}`}
        data-page-title={post.title}
        data-theme={isDarkMode ? 'dark' : 'light'}
      />
      <Script
        defer
        src={`${CUSDIS_BASE}/js/widget/lang/${language}.js`}
        onLoad={renderCusdis}
      />
      <Script src={`${CUSDIS_BASE}/js/cusdis.es.js`} onLoad={renderCusdis} />
    </>
  );
};

export default Cusdis;
