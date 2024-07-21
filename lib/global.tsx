import { generateLocaleDict, initLocale } from './lang';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BLOG from '@/blog.config';
import {
  THEMES,
  initTheme,
  initDarkMode,
  operateDarkMode,
  saveDarkModeToLocalStorage,
} from '@/themes/theme';
import { getQueryVariable } from './utils';
import { progressStart, progressDone } from '@/components/NProgress';

import type { FunctionComponent, ReactNode } from 'react';

export interface GlobalContextProps {
  lang: string;
  locale: unknown;
  theme: string;
  isDarkMode: boolean;
  onLoading: boolean;
  siteInfo: unknown;
  categoryOptions: unknown;
  tagOptions: unknown;
  updateLang: (lang: string) => void;
  updateLocale: (locale: unknown) => void;
  switchTheme: (theme: string) => void;
  setTheme: (theme: string) => void;
  updateDarkMode: (isDarkMode: boolean) => void;
  setOnLoading: (onLoading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps>({
  lang: BLOG.LANG,
  locale: {},
  theme: BLOG.THEME,
  isDarkMode: false,
  onLoading: false,
  siteInfo: {},
  categoryOptions: [],
  tagOptions: [],
  updateLang: () => {},
  updateLocale: () => {},
  switchTheme: () => {},
  setTheme: () => {},
  updateDarkMode: () => {},
  setOnLoading: () => {},
});

/**
 * 全局变量Provider，包括语言本地化、样式主题、搜索词
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const GlobalContextProvider: FunctionComponent<
  GlobalContextProps & {
    children: ReactNode;
  }
> = (props) => {
  const { children, siteInfo, categoryOptions, tagOptions } = props;
  const router = useRouter();
  // lang 为所选语言，如 zh-CN,
  // locale 为对应语言的配置对象
  const [lang, updateLang] = useState(BLOG.LANG); // 默认语言
  const [locale, updateLocale] = useState(generateLocaleDict(BLOG.LANG)); // 默认语言
  const [theme, setTheme] = useState(BLOG.THEME); // 默认博客主题
  const [isDarkMode, updateDarkMode] = useState(BLOG.APPEARANCE === 'dark'); // 默认深色模式
  const [onLoading, setOnLoading] = useState(false); // 抓取文章数据

  useEffect(() => {
    initLocale(lang, locale, updateLang, updateLocale);
    updateDarkMode(initDarkMode());
    initTheme();
  }, []);

  // 切换语言
  useEffect(() => {
    updateLocale(generateLocaleDict(lang));
  }, [lang]);

  // 切换暗黑模式
  useEffect(() => {
    saveDarkModeToLocalStorage(isDarkMode);
    operateDarkMode(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const handleStart = (url: string) => {
      progressStart();
      const { theme } = router.query;
      if (theme && !url.includes(`theme=${theme}`)) {
        const newUrl = `${url}${url.includes('?') ? '&' : '?'}theme=${theme}`;
        router.push(newUrl);
      }
      setOnLoading(true);
    };
    const handleStop = () => {
      progressDone();
      setOnLoading(false);
    };
    const queryTheme = getQueryVariable('theme') || BLOG.THEME;
    setTheme(queryTheme);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeError', handleStop);
    router.events.on('routeChangeComplete', handleStop);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  // 切换主题
  function switchTheme() {
    const currentIndex = THEMES.indexOf(theme);
    const newIndex = currentIndex < THEMES.length - 1 ? currentIndex + 1 : 0;
    const newTheme = THEMES[newIndex];
    const query = router.query;
    query.theme = newTheme;
    router.push({ pathname: router.pathname, query });
    return newTheme;
  }

  return (
    <GlobalContext.Provider
      value={{
        onLoading,
        setOnLoading,
        lang,
        updateLang,
        locale,
        updateLocale,
        isDarkMode,
        updateDarkMode,
        theme,
        setTheme,
        switchTheme,
        siteInfo,
        categoryOptions,
        tagOptions,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
