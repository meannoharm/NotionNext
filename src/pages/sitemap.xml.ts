import { getServerSideSitemap } from 'next-sitemap';
import { getSiteData } from '@/lib/notion/getSiteData';
import dayjs from 'dayjs';
import BLOG from 'blog.config';

import type { ISitemapField } from 'next-sitemap';
import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { allPages } = await getSiteData('rss');
  const lastmod = dayjs().format('YYYY-MM-DD');
  const defaultFields: ISitemapField[] = [
    {
      loc: `${BLOG.LINK}`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${BLOG.LINK}/archive`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${BLOG.LINK}/category`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${BLOG.LINK}/feed`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${BLOG.LINK}/search`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
    {
      loc: `${BLOG.LINK}/tag`,
      lastmod,
      changefreq: 'daily',
      priority: 0.7,
    },
  ];
  const postFields: ISitemapField[] = allPages
    ?.filter((p) => p.status === BLOG.NOTION_PROPERTY_NAME.status_publish)
    ?.map((post) => {
      const slugWithoutLeadingSlash = post?.slug.startsWith('/')
        ? post?.slug?.slice(1)
        : post.slug;
      return {
        loc: `${BLOG.LINK}/${slugWithoutLeadingSlash}`,
        lastmod: dayjs(post.publishDate).format('YYYY-MM-DD'),
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
