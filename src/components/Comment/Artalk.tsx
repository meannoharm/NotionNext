import BLOG from 'blog.config';
import 'artalk/Artalk.css';
import Artalk from 'artalk';
import { useEffect, useRef } from 'react';

import type { SiteInfo } from '@/types';
import { useTranslation } from 'next-i18next';

/**
 * @see https://artalk.js.org/
 */

const ArtalkComponent = ({ siteInfo }: { siteInfo: SiteInfo }) => {
  const artalkRef = useRef<HTMLDivElement>(null);
  const {
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    if (!artalkRef.current) return;
    Artalk.init({
      server: BLOG.COMMENT_ARTALK_SERVER, // 后端地址
      el: artalkRef.current, // 容器元素
      locale: language,
      site: siteInfo.title, // 你的站点名
    });
  }, [siteInfo.title, language]);

  return <div ref={artalkRef} />;
};

export default ArtalkComponent;
