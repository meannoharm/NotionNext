import { createStore } from 'zustand';

import type { Site } from '@/types';

export type SiteState = Omit<Site, 'allPages' | 'block' | 'config'>;

export interface SiteAction {
  updateState: (props: SiteState) => void;
}

export type SiteStore = SiteState & SiteAction;

export const defaultInitState: SiteState = {
  id: '',
  notice: null,
  siteInfo: {
    title: '',
    description: '',
    pageCover: '',
    icon: '',
  },
  tagOptions: [],
  categoryOptions: [],
  navList: [],
  publishedPosts: [],
  latestPosts: [],
};

export const createSiteStore = (initState: SiteState = defaultInitState) => {
  return createStore<SiteStore>()((set) => ({
    ...initState,
    updateState: (props) => set(props),
  }));
};
