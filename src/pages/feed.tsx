import type { GetServerSideProps } from 'next';
import RSS from 'rss';
import BLOG from 'blog.config';
import { getSiteData } from '@/lib/notion/getSiteData';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ error: 'method not allowed' }));
    res.end();
    return { props: {} };
  }

  const { allPages } = await getSiteData('feed');

  const ttlMinutes = 24 * 60; // 24 hours
  const ttlSeconds = ttlMinutes * 60;

  const feed = new RSS({
    title: BLOG.TITLE,
    site_url: BLOG.LINK,
    feed_url: `${BLOG.LINK}/feed.xml`,
    language: BLOG.LANG,
    ttl: ttlMinutes,
  });

  allPages.forEach((page) => {
    feed.item({
      title: page.title,
      url: `${BLOG.LINK}/${page.slug}`,
      date: new Date(page.date),
      description: page.summary,
    });
  });

  const feedText = feed.xml({ indent: true });

  res.setHeader(
    'Cache-Control',
    `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`,
  );
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.write(feedText);
  res.end();

  return { props: {} };
};

export default function noop() {
  return null;
}
