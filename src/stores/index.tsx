import { createStore } from 'zustand';

export interface GlobalState {
  theme: string;
  isDarkMode: boolean;
  isLoading: boolean;
}

export interface GlobalAction {
  setTheme: (theme: string) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export type GlobalStore = GlobalState & GlobalAction;

export const defaultInitState: GlobalState = {
  theme: '',
  isDarkMode: false,
  isLoading: false,
};

export const createGlobalStore = (
  initState: GlobalState = defaultInitState,
) => {
  return createStore<GlobalStore>()((set) => ({
    theme: initState.theme,
    isDarkMode: initState.isDarkMode,
    isLoading: initState.isLoading,
    setTheme: (theme) =>
      set(() => ({
        theme,
      })),
    setIsDarkMode: (isDarkMode: boolean) =>
      set(() => ({
        isDarkMode,
      })),
    setIsLoading: (isLoading: boolean) =>
      set(() => ({
        isLoading,
      })),
  }));
};
