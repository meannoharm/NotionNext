import type { FC } from 'react';
import type {
  ArchiveProps,
  CategoryProps,
  HomeProps,
  PageNotFoundProps,
} from '@/pages/types';

export type ArchiveComponent = FC<ArchiveProps>;
export type CategoryComponent = FC<CategoryProps>;
export type HomeComponent = FC<HomeProps>;
export type PageNotFoundComponent = FC<PageNotFoundProps>;
