import BLOG from '@/blog.config';
import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import * as ThemeComponents from '@theme-components';
// 所有主题在next.config.js中扫描
export const { THEMES = [] } = getConfig().publicRuntimeConfig;
/**
 * 加载主题文件
 * 如果是
 * @param {*} router
 * @returns
 */
export const getLayoutByTheme = (router) => {
  const themeQuery = getQueryParam(router.asPath, 'theme') || BLOG.THEME;
  const layout = getLayoutNameByPath(router.pathname);
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
 * @param {*} path
 * @returns
 */
export const getLayoutNameByPath = (path) => {
  switch (path) {
    case '/':
      return 'LayoutIndex';
    case '/archive':
      return 'LayoutArchive';
    case '/page/[page]':
    case '/category/[category]':
    case '/category/[category]/page/[page]':
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return 'LayoutPostList';
    case '/search':
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return 'LayoutSearch';
    case '/404':
      return 'Layout404';
    case '/tag':
      return 'LayoutTagIndex';
    case '/category':
      return 'LayoutCategoryIndex';
    default:
      return 'LayoutSlug';
  }
};

/**
 * 初始化主题 , 优先级 query > cookies > systemPrefer
 * @param isDarkMode
 * @description 读取cookie中存的用户主题
 */
export const initDarkMode = () => {
  // 查看用户设备浏览器是否深色模型
  let isDarkMode = isPreferDark();

  // 查看cookie中是否用户强制设置深色模式
  const cookieDarkMode = loadDarkModeFromLocalStorage();
  if (cookieDarkMode) {
    isDarkMode = JSON.parse(cookieDarkMode);
  }

  // url查询条件中是否深色模式
  const queryMode = getQueryVariable('mode');
  if (queryMode) {
    isDarkMode = queryMode === 'dark';
  }

  return isDarkMode;
};

export const operateDarkMode = (isDarkMode) => {
  const htmlElement = document.getElementsByTagName('html')[0];
  htmlElement.classList.toggle('light', !isDarkMode);
  htmlElement.classList.toggle('dark', isDarkMode);
};

/**
 * 是否优先深色模式， 根据系统深色模式以及当前时间判断
 * @returns {*}
 */
export function isPreferDark() {
  if (BLOG.APPEARANCE === 'dark') {
    return true;
  }
  if (BLOG.APPEARANCE === 'auto') {
    // 系统深色模式或时间是夜间时，强行置为夜间模式
    const date = new Date();
    const prefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    return (
      prefersDarkMode ||
      (BLOG.APPEARANCE_DARK_TIME &&
        (date.getHours() >= BLOG.APPEARANCE_DARK_TIME[0] ||
          date.getHours() < BLOG.APPEARANCE_DARK_TIME[1]))
    );
  }
  return false;
}

/**
 * 读取深色模式
 * @returns {*}
 */
export const loadDarkModeFromLocalStorage = () => {
  return localStorage.getItem('isDarkMode');
};

/**
 * 保存深色模式
 * @param isDarkMode
 */
export const saveDarkModeToLocalStorage = (isDarkMode) => {
  localStorage.setItem('isDarkMode', isDarkMode);
};

/**
 * 读取默认主题
 * @returns {*}
 */
export const loadThemeFromLocalStorage = () => {
  return localStorage.getItem('theme');
};

/**
 * 保存默认主题
 * @param newTheme
 */
export const saveThemeToLocalStorage = (newTheme) => {
  localStorage.setItem('theme', newTheme);
};

/**
 * 切换主题时的特殊处理
 * @param {*} setTheme
 */
export const initTheme = () => {
  if (isBrowser) {
    setTimeout(() => {
      const elements = document.querySelectorAll('[id^="theme-"]');
      if (elements?.length > 1) {
        elements[elements.length - 1].scrollIntoView();
        // 删除前面的元素，只保留最后一个元素
        for (let i = 0; i < elements.length - 1; i++) {
          elements[i]?.parentNode?.removeChild(elements[i]);
        }
      }
    }, 500);
  }
};
