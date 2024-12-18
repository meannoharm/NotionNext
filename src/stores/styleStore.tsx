import { operateDarkMode } from '@/lib/darkMode';
import { saveDarkModeToLocalStorage } from '@/lib/darkMode';
import { createStore } from 'zustand';
import { THEMES } from '@/constants';

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
  theme: THEMES[0],
  themeList: THEMES,
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
