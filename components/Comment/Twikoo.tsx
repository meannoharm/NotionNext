import { useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import Script from 'next/script';
import { useConfigStore } from 'providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

/**
 * @see https://twikoo.js.org/
 */
const Twikoo = () => {
  const twikooRef = useRef<HTMLDivElement>(null);
  const {
    i18n: { language },
  } = useTranslation();
  const { TWIKOO_CDN, TWIKOO_ID } = useConfigStore(
    useShallow((state) => ({
      TWIKOO_CDN: state.TWIKOO_CDN,
      TWIKOO_ID: state.TWIKOO_ID,
    })),
  );

  const loadTwikoo = () => {
    if (twikooRef.current) {
      (window as any)?.twikoo?.init({
        envId: TWIKOO_ID,
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
      <Script src={TWIKOO_CDN} onLoad={loadTwikoo}></Script>
    </>
  );
};

export default Twikoo;
