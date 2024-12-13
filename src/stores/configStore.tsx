import { SiteConfig } from '@/types';
import { createStore } from 'zustand';
import defaultConfig from 'site.config';

export type ConfigStore = SiteConfig & {
  setConfig: (config: SiteConfig) => void;
};

export const createConfigStore = (
  initState: SiteConfig = defaultConfig,
) => {
  return createStore<ConfigStore>((set) => ({
    ...initState,
    setConfig: (config) => set((state) => ({ ...state, ...config })),
  }));
};
