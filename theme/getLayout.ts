import BLOG from '@/blog.config';
import { getQueryParam } from '../lib/utils';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import * as ThemeComponents from '@theme-components';

import type { NextRouter } from 'next/router';

// 所有主题在next.config.js中扫描
export const { THEMES = [] } = getConfig().publicRuntimeConfig;
/**
 * 加载主题文件
 * 如果是
 * @param {*} router
 * @returns
 */
export const getLayoutByTheme: (router: NextRouter) => React.ComponentType = (
  router,
) => {
  const themeQuery = getQueryParam(router.asPath, 'theme') || BLOG.THEME;
  const layout = getLayoutNameByPathName(router.pathname);
  if (themeQuery !== BLOG.THEME) {
    return dynamic(
      () => import(`@/themes/${themeQuery}`).then((m) => m[layout]),
      { ssr: true },
    );
  } else {
    return ThemeComponents[layout];
  }
};

/**
 * 根据路径 获取对应的layout
 * @param {*} pathname
 * @returns
 */
export const getLayoutNameByPathName = (pathname: string) => {
  switch (pathname) {
    case '/':
      return 'Home';
    case '/archive':
      return 'Archive';
    case '/page/[page]':
    case '/category/[category]':
    case '/category/[category]/page/[page]':
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return 'PostList';
    case '/search':
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return 'Search';
    case '/404':
      return 'PageNotFound';
    case '/tag':
      return 'Tag';
    case '/category':
      return 'Category';
    default:
      return 'Post';
  }
};
