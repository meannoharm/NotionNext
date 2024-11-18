const BLOG = require('./blog.config');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
};
