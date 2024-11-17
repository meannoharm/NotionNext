import { createStore } from 'zustand';

import { SiteInfo, PageInfo } from '@/lib/notion';

export interface NobeliumState {
  siteInfo: SiteInfo;
  latestPosts: PageInfo[];
}

export interface NobeliumAction {
  updateSiteInfo: (siteInfo: NobeliumStore['siteInfo']) => void;
  updateLatestPosts: (latestPosts: NobeliumStore['latestPosts']) => void;
}

export type NobeliumStore = NobeliumState & NobeliumAction;

export const defaultInitState: NobeliumState = {
  siteInfo: {
    title: '',
    description: '',
    pageCover: '',
    icon: '',
  },
  latestPosts: [],
};

export const createNobeliumStore = (
  initState: NobeliumState = defaultInitState,
) => {
  return createStore<NobeliumStore>()((set) => ({
    siteInfo: initState.siteInfo,
    latestPosts: initState.latestPosts,
    updateSiteInfo: (siteInfo) =>
      set(() => ({
        siteInfo: siteInfo,
      })),
    updateLatestPosts: (latestPosts) =>
      set(() => ({
        latestPosts: latestPosts,
      })),
  }));
};
