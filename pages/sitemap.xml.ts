import { getServerSideSitemap } from 'next-sitemap';
import { getSiteData } from 'lib/notion/getSiteData';
import dayjs from 'dayjs';
import { SITE_URL } from '@/constants';

import type { ISitemapField } from 'next-sitemap';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { allPages } = await getSiteData('rss');
  const lastmod = dayjs().format('YYYY-MM-DD');
  const defaultFields: ISitemapField[] = [
    {
      loc: `${SITE_URL}`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/archive`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/category`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/feed`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/search`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${SITE_URL}/tag`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
  ];
  const postFields: ISitemapField[] = allPages.map((post) => {
    const slugWithoutLeadingSlash = post.slug.startsWith('/')
      ? post.slug.slice(1)
      : post.slug;
    return {
      loc: `${SITE_URL}/${slugWithoutLeadingSlash}`,
      lastmod: dayjs(post.date).format('YYYY-MM-DD'),
      changefreq: 'daily',
      priority: 0.7,
    };
  });
  const fields = defaultFields.concat(postFields);

  // 缓存
  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59',
  );

  return getServerSideSitemap(ctx, fields);
};

export default function SitemapIndex() {}
