import { operateDarkMode } from 'lib/darkMode';
import { saveDarkModeToLocalStorage } from 'lib/darkMode';
import { createStore } from 'zustand';
import getConfig from 'next/config';
import { THEMES } from '@/constants';

export const { ALL_THEMES } = getConfig().publicRuntimeConfig;

if (!ALL_THEMES && ALL_THEMES.length === 0) {
  throw new Error('Please define theme in /themes directory');
}

export const themes = THEMES.filter((theme: string) =>
  ALL_THEMES.includes(theme),
);

export interface StyleState {
  theme: string;
  themeList: string[];
  isDarkMode: boolean;
  isLoading: boolean;
}

export interface StyleAction {
  setTheme: (theme: string) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export type StyleStore = StyleState & StyleAction;

export const defaultInitState: StyleState = {
  theme: themes[0],
  themeList: themes,
  isDarkMode: false,
  isLoading: false,
};

export const createStyleStore = (initState: StyleState = defaultInitState) => {
  const store = createStore<StyleStore>()((set) => ({
    ...initState,
    setTheme: (theme: string) => set({ theme }),
    setIsDarkMode: (isDarkMode) => {
      saveDarkModeToLocalStorage(isDarkMode);
      operateDarkMode(isDarkMode);
      set({ isDarkMode });
    },
    setIsLoading: (isLoading) => set({ isLoading }),
  }));

  return store;
};
