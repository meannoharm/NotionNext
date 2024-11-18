import { useGlobal } from '@/context/global';
import BLOG from 'blog.config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { loadExternalResource } from '@/lib/utils';
import { useTranslation } from 'next-i18next';

const CusdisComponent = ({ frontMatter }) => {
  const router = useRouter();
  const { isDarkMode } = useGlobal();
  const { i18n } = useTranslation();

  //   处理cusdis主题
  useEffect(() => {
    loadExternalResource(BLOG.COMMENT_CUSDIS_SCRIPT_SRC, 'js').then(() => {
      const CUSDIS = window.CUSDIS;
      CUSDIS?.initial();
    });
  }, [isDarkMode]);

  return (
    <div
      id="cusdis_thread"
      lang={i18n.language}
      data-host={BLOG.COMMENT_CUSDIS_HOST}
      data-app-id={BLOG.COMMENT_CUSDIS_APP_ID}
      data-page-id={frontMatter.id}
      data-page-url={BLOG.LINK + router.asPath}
      data-page-title={frontMatter.title}
      data-theme={isDarkMode ? 'dark' : 'light'}
    ></div>
  );
};

export default CusdisComponent;
