import { getServerSideSitemap } from 'next-sitemap';
import { getSiteData } from '@/utils/notion/getSiteData';
import dayjs from 'dayjs';
import { BASE_URL } from '@/constants';

import type { ISitemapField } from 'next-sitemap';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const baseUrl = BASE_URL || ctx.req.headers.origin;
  const { allPages } = await getSiteData('rss');
  const lastmod = dayjs().format('YYYY-MM-DD');
  const defaultFields: ISitemapField[] = [
    {
      loc: `${baseUrl}`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/archive`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/category`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/feed`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/search`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${baseUrl}/tag`,
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
      loc: `${baseUrl}/${slugWithoutLeadingSlash}`,
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
