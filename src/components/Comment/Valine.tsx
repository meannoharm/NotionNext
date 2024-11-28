import BLOG from 'blog.config';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useTranslation } from 'next-i18next';
import { Page } from '@/types/notion';

/**
 * Valine评论 @see https://valine.js.org/
 */
const Valine = ({ post }: { post: Page }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    i18n: { language },
  } = useTranslation();


  const loadValine = () => {
    const Valine = (window as any).Valine;

    if (Valine && containerRef.current) {
      new Valine({
        el: containerRef.current, // 容器元素
        lang: language,
        appId: BLOG.COMMENT_VALINE_APP_ID,
        appKey: BLOG.COMMENT_VALINE_APP_KEY,
        path: post.id,
        recordIP: true,
        serverURLs: BLOG.COMMENT_VALINE_SERVER_URLS,
        visitor: true,
      });
    }
  };

  useEffect(() => {
    loadValine();
  }, [post, language]);

  return (
    <>
      <div ref={containerRef}></div>
      <Script
        src={`${BLOG.CDN}/valine/1.5.2/Valine.min.js`}
        onLoad={loadValine}
      />
    </>
  );
};

export default Valine;
