import 'artalk/Artalk.css';
import Artalk from 'artalk';
import { useEffect, useRef } from 'react';
import { useConfigStore } from '@/providers/configProvider';

import type { SiteInfo } from '@/types';
import { useTranslation } from 'next-i18next';

/**
 * @see https://artalk.js.org/
 */

const ArtalkComponent = ({ siteInfo }: { siteInfo: SiteInfo }) => {
  const ARTALK_SERVER = useConfigStore((state) => state.ARTALK_SERVER);
  const artalkRef = useRef<HTMLDivElement>(null);
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    if (!artalkRef.current) return;

    const instance = Artalk.init({
      server: ARTALK_SERVER,
      el: artalkRef.current,
      locale: language,
      site: siteInfo.title,
    });

    return () => {
      instance?.destroy();
    };
  }, [siteInfo.title, language, ARTALK_SERVER]);

  return <div ref={artalkRef} />;
};

export default ArtalkComponent;
