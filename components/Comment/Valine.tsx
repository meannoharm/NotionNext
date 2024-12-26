import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useTranslation } from 'next-i18next';
import { Page } from '@/types/notion';
import { useConfigStore } from 'providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

/**
 * Valine评论 @see https://valine.js.org/
 */
const Valine = ({ post }: { post: Page }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    i18n: { language },
  } = useTranslation();
  const { VALINE_CDN, VALINE_APP_ID, VALINE_APP_KEY, VALINE_SERVER_URLS } =
    useConfigStore(
      useShallow((state) => ({
        VALINE_CDN: state.VALINE_CDN,
        VALINE_APP_ID: state.VALINE_APP_ID,
        VALINE_APP_KEY: state.VALINE_APP_KEY,
        VALINE_SERVER_URLS: state.VALINE_SERVER_URLS,
      })),
    );

  const loadValine = () => {
    const Valine = (window as any).Valine;

    if (Valine && containerRef.current) {
      new Valine({
        el: containerRef.current, // 容器元素
        lang: language,
        appId: VALINE_APP_ID,
        appKey: VALINE_APP_KEY,
        path: post.id,
        recordIP: true,
        serverURLs: VALINE_SERVER_URLS,
        visitor: true,
      });
    }
  };

  useEffect(() => {
    loadValine();
  }, [
    post,
    language,
    VALINE_CDN,
    VALINE_APP_ID,
    VALINE_APP_KEY,
    VALINE_SERVER_URLS,
  ]);

  return (
    <>
      <div ref={containerRef}></div>
      <Script src={VALINE_CDN} onLoad={loadValine} />
    </>
  );
};

export default Valine;
