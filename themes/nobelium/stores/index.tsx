import { createStore } from 'zustand';

import { SiteInfo, Page, Nav, Tag, Category } from '@/types';

export interface NobeliumState {
  siteInfo: SiteInfo;
  latestPosts: Page[];
  navList: Nav[];
  tags: Tag[];
  category: Category[];
}

export interface NobeliumAction {
  updateState: (props: NobeliumState) => void;
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
  navList: [],
  tags: [],
  category: [],
};

export const createNobeliumStore = (
  initState: NobeliumState = defaultInitState,
) => {
  return createStore<NobeliumStore>()((set) => ({
    siteInfo: initState.siteInfo,
    latestPosts: initState.latestPosts,
    navList: initState.navList,
    tags: initState.tags,
    category: initState.category,
    updateState: (props) =>
      set(() => ({
        ...props,
      })),
  }));
};
