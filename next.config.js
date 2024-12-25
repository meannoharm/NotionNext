const path = require('path');
const fs = require('fs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { i18n } = require('./next-i18next.config');

const themes = fs
  .readdirSync(path.resolve(__dirname, 'themes'))
  .map((theme) => {
    const fullPath = path.resolve(__dirname, 'themes', theme);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      return theme;
    }
  })
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  images: {
    // 图片压缩
    formats: ['image/avif', 'image/webp'],
    // 允许next/image加载的图片 域名
    domains: [
      'gravatar.com',
      'www.notion.so',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'p1.qhimg.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  i18n,
  transpilePackages: ['react-tweet'],
  publicRuntimeConfig: {
    ALL_THEMES: themes,
  },
});

module.exports = nextConfig;
