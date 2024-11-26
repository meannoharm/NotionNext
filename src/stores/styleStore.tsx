import { operateDarkMode } from '@/lib/darkMode';
import { saveDarkModeToLocalStorage } from '@/lib/darkMode';
import BLOG from 'blog.config';
import { createStore } from 'zustand';

export interface StyleState {
  theme: string;
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
  theme: BLOG.THEME,
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
