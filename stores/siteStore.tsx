import { createStore } from 'zustand';
import md5 from 'js-md5';

import type { Page, Archive } from '@/types/notion';
import type { SiteDataState } from '@/types/page';

export type RenderDataState = {
  posts: Page[];
  page: number;
  postCount: number;
  keyword: string;
  category: string;
  tag: string;
  archive: Archive;
};

export type PostDataState = {
  post: Page | null;
  isLock: boolean;
  validPassword: (password: string) => boolean;
};

export type SiteState = SiteDataState & RenderDataState & PostDataState;

export interface SiteAction {
  updatePost: (post: Page | null) => void;
  resetPost: () => void;
  updateIsLock: (isLock: boolean) => void;
  updateSiteDataState: (props: SiteDataState) => void;
  updateRenderPosts: (posts: Page[], page: number, postCount: number) => void;
  updatePage: (page: number) => void;
  updateKeyword: (keyword: string) => void;
  updateCategory: (category: string) => void;
  updateTag: (tag: string) => void;
  updateArchive: (archive: Archive) => void;
}

export type SiteStore = SiteState & SiteAction;

export const defaultInitState: SiteState = {
  post: null,
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
  latestPosts: [],
  totalPostsCount: 0,
  archive: {},
  posts: [],
  page: 0,
  postCount: 0,
  keyword: '',
  category: '',
  tag: '',
  isLock: false,
  validPassword: () => false,
};

export const createSiteStore = (initState: SiteState = defaultInitState) => {
  const store = createStore<SiteStore>()((set) => ({
    ...initState,
    updatePost: (post) => {
      if (post?.password) {
        set({
          isLock: true,
          validPassword: (password: string) => {
            const encrypt = md5(post.slug + password);
            if (password && encrypt === post.password) {
              set({ isLock: false });
              return true;
            }
            return false;
          },
        });
      } else {
        set({ isLock: false, validPassword: () => false });
      }
      set({ post });
    },
    resetPost: () => set({ post: null }),
    updateIsLock: (isLock) => set({ isLock }),
    updateSiteDataState: (props) =>
      set({
        notice: props.notice,
        siteInfo: props.siteInfo,
        tagOptions: props.tagOptions,
        categoryOptions: props.categoryOptions,
        navList: props.navList,
        latestPosts: props.latestPosts,
        totalPostsCount: props.totalPostsCount,
      }),
    updateRenderPosts: (posts, page, postCount) =>
      set({
        posts,
        page,
        postCount,
      }),
    updatePage: (page) => set({ page }),
    updateKeyword: (keyword) => set({ keyword }),
    updateCategory: (category) => set({ category }),
    updateTag: (tag) => set({ tag }),
    updateArchive: (archive) => set({ archive }),
  }));

  return store;
};
