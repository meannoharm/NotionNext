import type { GetServerSideProps } from 'next';
import RSS from 'rss';
import { getSiteData } from '@/utils/notion/getSiteData';
import { BASE_URL } from '@/constants';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const baseUrl = BASE_URL || req.headers.origin;
  if (!baseUrl) return { props: {} };

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ error: 'method not allowed' }));
    res.end();
    return { props: {} };
  }

  const { allPages, siteInfo } = await getSiteData('feed');

  const ttlMinutes = 24 * 60; // 24 hours
  const ttlSeconds = ttlMinutes * 60;

  const feed = new RSS({
    title: siteInfo.title,
    site_url: baseUrl,
    feed_url: `${baseUrl}/feed.xml`,
    ttl: ttlMinutes,
  });

  allPages.forEach((page) => {
    feed.item({
      title: page.title,
      url: `${baseUrl}/${page.slug}`,
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
