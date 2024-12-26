import { createStore } from 'zustand';

import type { Page, SiteInfo, Tag, Category, Nav, Archive } from '@/types/notion';
import md5 from 'js-md5';

export type SiteDataState = {
  notice: Page | null;
  siteInfo: SiteInfo;
  tagOptions: Tag[];
  categoryOptions: Category[];
  navList: Nav[];
  latestPosts: Page[];
};

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
    updateIsLock: (isLock) => set({ isLock }),
    updateSiteDataState: (props) =>
      set({
        notice: props.notice,
        siteInfo: props.siteInfo,
        tagOptions: props.tagOptions,
        categoryOptions: props.categoryOptions,
        navList: props.navList,
        latestPosts: props.latestPosts,
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
