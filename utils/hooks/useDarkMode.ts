import { useStyleStore } from '@/providers/styleProvider';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const useDarkMode = () => {
  const { isDarkMode } = useStyleStore(
    useShallow((state) => {
      return {
        isDarkMode: state.isDarkMode,
        setIsDarkMode: state.setIsDarkMode,
      };
    }),
  );

  useEffect(() => {
    // if isDarkMode is True, then set dark mode
    if (isDarkMode) {
      operateDarkMode(isDarkMode);
    } else {
      // if isDarkMode is False, mean follow system preference
      const isDark = getMediaQueryPreference();
      operateDarkMode(isDark);
    }
  }, [isDarkMode]);
};

export const getMediaQueryPreference = () => {
  const mediaQuery = '(prefers-color-scheme: dark)';
  const mql = window.matchMedia(mediaQuery);
  const hasPreference = typeof mql.matches === 'boolean';
  if (hasPreference) {
    return mql.matches ? true : false;
  }
  return false;
};

export const operateDarkMode = (isDarkMode: boolean) => {
  const htmlElement = document.getElementsByTagName('html')[0];
  htmlElement.classList.toggle('dark', isDarkMode);
};

export default useDarkMode;
