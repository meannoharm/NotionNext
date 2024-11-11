import type { FC } from 'react';
import type {
  ThemeArchiveProps,
  ThemeCategoryProps,
  ThemeCategoryDetailProps,
  ThemeHomeProps,
  ThemePageNotFoundProps,
  ThemePageProps,
  ThemeCategoryPageProps,
  ThemeTagIndexProps,
  ThemeTagDetailProps,
  ThemeTagPageProps,
  ThemeSearchIndexProps,
  ThemeSearchDetailProps,
  ThemeSearchPageProps,
  ThemeSlugIndexProps,
  ThemePrefixSlugProps,
} from '@/pages/types';

export type HomeComponent = FC<ThemeHomeProps>;
export type PageNotFoundComponent = FC<ThemePageNotFoundProps>;
export type ArchiveComponent = FC<ThemeArchiveProps>;
export type PostListComponent = FC<ThemePageProps>;
export type CategoryComponent = FC<ThemeCategoryProps>;
export type CategoryDetailComponent = FC<ThemeCategoryDetailProps>;
export type CategoryPageComponent = FC<ThemeCategoryPageProps>;
export type TagIndexComponent = FC<ThemeTagIndexProps>;
export type TagDetailComponent = FC<ThemeTagDetailProps>;
export type TagPageComponent = FC<ThemeTagPageProps>;
export type SearchIndexComponent = FC<ThemeSearchIndexProps>;
export type SearchDetailComponent = FC<ThemeSearchDetailProps>;
export type SearchPageComponent = FC<ThemeSearchPageProps>;
export type SlugIndexComponent = FC<ThemeSlugIndexProps>;
export type PrefixSlugComponent = FC<ThemePrefixSlugProps>;
