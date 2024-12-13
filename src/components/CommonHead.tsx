import Head from 'next/head';
import { useConfigStore } from '@/providers/configProvider';
import { useShallow } from 'zustand/react/shallow';
import { useSiteStore } from '@/providers/siteProvider';
import { SITE_URL } from '@/constants';

import type { FC } from 'react';
import type { PageMeta } from '@/types';
import { useTranslation } from 'next-i18next';

export interface CommonHeadProps {
  pageMeta: PageMeta;
}

const CommonHead: FC<CommonHeadProps> = ({ pageMeta }) => {
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const {
    AUTHOR,
    SUB_PATH,
    KEYWORDS,
    SEO_GOOGLE_SITE_VERIFICATION,
    SEO_BAIDU_SITE_VERIFICATION,
    FACEBOOK_PAGE,
  } = useConfigStore(
    useShallow((state) => ({
      AUTHOR: state.AUTHOR,
      SUB_PATH: state.SUB_PATH,
      KEYWORDS: state.KEYWORDS,
      SEO_GOOGLE_SITE_VERIFICATION: state.SEO_GOOGLE_SITE_VERIFICATION,
      SEO_BAIDU_SITE_VERIFICATION: state.SEO_BAIDU_SITE_VERIFICATION,
      FACEBOOK_PAGE: state.FACEBOOK_PAGE,
    })),
  );
  const {
    i18n: { language },
  } = useTranslation();

  const baseUrl = SUB_PATH ? `${SITE_URL}/${SUB_PATH}` : SITE_URL;
  const url = pageMeta?.slug ? `${baseUrl}/${pageMeta.slug}` : baseUrl;
  // TODO: prepare default background image
  const image = pageMeta?.image || '/bg_image.jpg';
  const title = pageMeta?.title || siteInfo.title;
  const description = pageMeta?.description || siteInfo.description;
  const type = pageMeta?.type || 'website';
  const keywords = pageMeta?.tags?.join(',') || KEYWORDS;
  const lang = language.replace('-', '_'); // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = pageMeta?.category || KEYWORDS; // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類

  return (
    <Head>
      <title>{title}</title>
      <meta
        name="theme-color"
        content="#ffffff"
        media="(prefers-color-scheme: light)"
      />
      <meta
        name="theme-color"
        content="#151515"
        media="(prefers-color-scheme: dark)"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0"
      />
      <meta name="robots" content="follow, index" />
      <meta charSet="UTF-8" />
      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name="google-site-verification"
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name="baidu-site-verification"
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta property="og:locale" content={lang} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteInfo.title} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:title" content={title} />

      {pageMeta?.type === 'Post' && (
        <>
          <meta
            property="article:published_time"
            content={pageMeta?.publishDay}
          />
          <meta property="article:author" content={AUTHOR} />
          <meta property="article:section" content={category} />
          <meta property="article:publisher" content={FACEBOOK_PAGE || ''} />
        </>
      )}

      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${SITE_URL}`}
        title={title}
      />
    </Head>
  );
};

export default CommonHead;
