import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BLOG from 'blog.config';
import { THEMES, initTheme } from '@/lib/theme';
import {
  initDarkMode,
  operateDarkMode,
  saveDarkModeToLocalStorage,
} from '@/lib/darkMode';
import { getQueryVariable } from '@/lib/utils';
import { progressStart, progressDone } from '@/components/NProgress';

import type { FunctionComponent, ReactNode } from 'react';

export interface GlobalContextProps {
  theme: string;
  isDarkMode: boolean;
  isLoading: boolean;
  switchTheme: (theme: string) => void;
  setTheme: (theme: string) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextProps>({
  theme: BLOG.THEME,
  isDarkMode: false,
  isLoading: false,
  switchTheme: () => {},
  setTheme: () => {},
  setIsDarkMode: () => {},
  setIsLoading: () => {},
});

/**
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
export const GlobalContextProvider: FunctionComponent<
  GlobalContextProps & {
    children: ReactNode;
  }
> = (props) => {
  const { children } = props;
  const router = useRouter();
  const [theme, setTheme] = useState(BLOG.THEME); // 默认博客主题
  const [isDarkMode, setIsDarkMode] = useState(BLOG.APPEARANCE === 'dark'); // 默认深色模式
  const [isLoading, setIsLoading] = useState(false); // 抓取文章数据

  useEffect(() => {
    setIsDarkMode(initDarkMode());
    initTheme();
  }, []);

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
      setIsLoading(true);
    };
    const handleStop = () => {
      progressDone();
      setIsLoading(false);
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
        isLoading,
        setIsLoading,
        isDarkMode,
        setIsDarkMode,
        theme,
        setTheme,
        switchTheme,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
