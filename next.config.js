// const fs = require('fs');
const path = require('path');
const { THEME } = require('./blog.config');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const { i18n } = require('./next-i18next.config');

// function scanSubdirectories(directory) {
//   const subdirectories = [];

//   fs.readdirSync(directory).forEach((file) => {
//     const fullPath = path.join(directory, file);
//     const stats = fs.statSync(fullPath);

//     // landing主题比较特殊，不在可切换的主题中显示
//     if (stats.isDirectory() && file !== 'landing') {
//       subdirectories.push(file);
//     }
//   });

//   return subdirectories;
// }

// const themes = scanSubdirectories(path.resolve(__dirname, 'themes'));

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
      'webmention.io',
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
  webpack: (config) => {
    // 动态主题：添加 resolve.alias 配置，将动态路径映射到实际路径
    config.resolve.alias['@theme-components'] = path.resolve(
      __dirname,
      'themes',
      THEME,
    );
    return config;
  },
  i18n,
  transpilePackages: ['react-tweet'],
});

module.exports = nextConfig;
