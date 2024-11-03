import type { FC } from 'react';
import type {
  ArchiveProps,
  CategoryProps,
  HomeProps,
  PageNotFoundProps,
  PostListProps,
} from '@/pages/types';

export type ArchiveComponent = FC<ArchiveProps>;
export type CategoryComponent = FC<CategoryProps>;
export type HomeComponent = FC<HomeProps>;
export type PageNotFoundComponent = FC<PageNotFoundProps>;
export type PostComponents = FC;
export type PostListComponent = FC<PostListProps>;
export type SearchComponent = FC;
export type TagComponent = FC;
