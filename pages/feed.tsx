import type { GetServerSideProps } from 'next';
import RSS from 'rss';
import { getSiteData } from '@/utils/notion/getSiteData';
import { SITE_URL } from '@/constants';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
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
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/feed.xml`,
    ttl: ttlMinutes,
  });

  allPages.forEach((page) => {
    feed.item({
      title: page.title,
      url: `${SITE_URL}/${page.slug}`,
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
