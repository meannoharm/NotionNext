import { createStore } from 'zustand';

import { SiteInfo, Page, Nav } from '@/types';

export interface NobeliumState {
  siteInfo: SiteInfo;
  latestPosts: Page[];
  navList: Nav[];
}

export interface NobeliumAction {
  updateSiteInfo: (siteInfo: NobeliumStore['siteInfo']) => void;
  updateLatestPosts: (latestPosts: NobeliumStore['latestPosts']) => void;
  updateNavList: (navList: NobeliumStore['navList']) => void;
}

export interface NobeliumStore {
  siteInfo: SiteInfo;
  latestPosts: Page[];
  navList: Nav[];
  updateSiteInfo: (siteInfo: NobeliumStore['siteInfo']) => void;
  updateLatestPosts: (latestPosts: NobeliumStore['latestPosts']) => void;
  updateNavList: (navList: NobeliumStore['navList']) => void;
}

export const defaultInitState: NobeliumState = {
  siteInfo: {
    title: '',
    description: '',
    pageCover: '',
    icon: '',
  },
  latestPosts: [],
  navList: [],
};

export const createNobeliumStore = (
  initState: NobeliumState = defaultInitState,
) => {
  return createStore<NobeliumStore>()((set) => ({
    siteInfo: initState.siteInfo,
    latestPosts: initState.latestPosts,
    navList: initState.navList,
    updateSiteInfo: (siteInfo) =>
      set(() => ({
        siteInfo: siteInfo,
      })),
    updateLatestPosts: (latestPosts) =>
      set(() => ({
        latestPosts: latestPosts,
      })),
    updateNavList: (navList) =>
      set(() => ({
        navList: navList,
      })),
  }));
};
