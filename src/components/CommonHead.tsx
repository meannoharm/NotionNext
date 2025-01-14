import BLOG from 'blog.config';
import Head from 'next/head';

import type { FC } from 'react';
import type { PageMeta } from '@/types';

export interface CommonHeadProps {
  pageMeta: PageMeta;
}

const CommonHead: FC<CommonHeadProps> = ({ pageMeta }) => {
  let url = BLOG.SUB_PATH?.length ? `${BLOG.LINK}/${BLOG.SUB_PATH}` : BLOG.LINK;
  let image;
  if (pageMeta) {
    url = `${url}/${pageMeta.slug}`;
    image = pageMeta.image || '/bg_image.jpg';
  }
  const title = pageMeta?.title || BLOG.TITLE;
  const description = pageMeta?.description || BLOG.DESCRIPTION;
  const type = pageMeta?.type || 'website';
  const keywords = pageMeta?.tags?.join(',') || BLOG.KEYWORDS;
  const lang = BLOG.LANG.replace('-', '_'); // Facebook OpenGraph 要 zh_CN 這樣的格式才抓得到語言
  const category = pageMeta?.category || BLOG.KEYWORDS || '軟體科技'; // section 主要是像是 category 這樣的分類，Facebook 用這個來抓連結的分類

  return (
    <Head>
      <title>{title}</title>
      <meta name="theme-color" content={BLOG.BACKGROUND_DARK} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0"
      />
      <meta name="robots" content="follow, index" />
      <meta charSet="UTF-8" />
      {BLOG.SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name="google-site-verification"
          content={BLOG.SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {BLOG.SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name="baidu-site-verification"
          content={BLOG.SEO_BAIDU_SITE_VERIFICATION}
        />
      )}
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta property="og:locale" content={lang} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={BLOG.TITLE} />
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
          <meta property="article:author" content={BLOG.AUTHOR} />
          <meta property="article:section" content={category} />
          <meta
            property="article:publisher"
            content={BLOG.FACEBOOK_PAGE || ''}
          />
        </>
      )}

      <link
        rel="alternate"
        type="application/rss+xml"
        href={`${BLOG.LINK}`}
        title={title}
      />
    </Head>
  );
};

export default CommonHead;
