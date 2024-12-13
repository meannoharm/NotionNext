import { SiteConfig } from '@/types';
import { createStore } from 'zustand';

export type ConfigStore = SiteConfig & {
  setConfig: (config: SiteConfig) => void;
};

export const defaultConfigState: SiteConfig = {};

export const createConfigStore = (
  initState: SiteConfig = defaultConfigState,
) => {
  return createStore<ConfigStore>((set) => ({
    ...initState,
    setConfig: (config) => set((state) => ({ ...state, ...config })),
  }));
};
