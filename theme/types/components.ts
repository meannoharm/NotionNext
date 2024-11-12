import type { FC } from 'react';
import type {
  ThemeHomeProps,
  ThemeArchiveProps,
  ThemeCategoryProps,
  ThemeCategoryDetailProps,
  ThemePageNotFoundProps,
  ThemePageProps,
  ThemeCategoryPageProps,
  ThemeTagProps,
  ThemeTagDetailProps,
  ThemeTagPageProps,
  ThemeSearchProps,
  ThemeSearchDetailProps,
  ThemeSearchPageProps,
  ThemePrefixProps,
  ThemePrefixSlugProps,
} from '@/pages/types';

export type HomeComponent = FC<ThemeHomeProps>;
export type PageComponent = FC<ThemePageProps>;
export type ArchiveComponent = FC<ThemeArchiveProps>;
export type CategoryComponent = FC<ThemeCategoryProps>;
export type CategoryDetailComponent = FC<ThemeCategoryDetailProps>;
export type CategoryPageComponent = FC<ThemeCategoryPageProps>;
export type TagComponent = FC<ThemeTagProps>;
export type TagDetailComponent = FC<ThemeTagDetailProps>;
export type TagPageComponent = FC<ThemeTagPageProps>;
export type SearchComponent = FC<ThemeSearchProps>;
export type SearchDetailComponent = FC<ThemeSearchDetailProps>;
export type SearchPageComponent = FC<ThemeSearchPageProps>;
export type PrefixComponent = FC<ThemePrefixProps>;
export type PrefixSlugComponent = FC<ThemePrefixSlugProps>;
export type PageNotFoundComponent = FC<ThemePageNotFoundProps>;
