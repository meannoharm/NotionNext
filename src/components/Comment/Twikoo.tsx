import BLOG from 'blog.config';
import { useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Script from 'next/script';

/**
 * @see https://twikoo.js.org/
 */
const Twikoo = () => {
  const twikooRef = useRef<HTMLDivElement>(null);
  const {
    i18n: { language },
  } = useTranslation();

  const loadTwikoo = () => {
    if (twikooRef.current) {
      (window as any)?.twikoo?.init({
        envId: BLOG.COMMENT_TWIKOO_ENV_ID,
        el: twikooRef.current,
        lang: language,
      });
    }
  };

  useEffect(() => {
    loadTwikoo();
  }, [language]);

  return (
    <>
      <div ref={twikooRef} />
      <Script
        src={`${BLOG.CDN}/twikoo/1.6.40/twikoo.min.js`}
        onLoad={loadTwikoo}
      ></Script>
    </>
  );
};

export default Twikoo;
