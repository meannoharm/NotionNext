declare module '@theme-components' {
  export const Home: React.FC<import('@/pages/types').ThemeHomeProps>;
  export const Page: React.FC<import('@/pages/types').ThemePageProps>;
  export const Archive: React.FC<import('@/pages/types').ThemeArchiveProps>;
  export const Category: React.FC<import('@/pages/types').ThemeCategoryProps>;
  export const CategoryDetail: React.FC<
    import('@/pages/types').ThemeCategoryDetailProps
  >;
  export const CategoryPage: React.FC<
    import('@/pages/types').ThemeCategoryPageCoProps
  >;
  export const Tag: React.FC<import('@/pages/types').ThemeTagProps>;
  export const TagDetail: React.FC<import('@/pages/types').ThemeTagDetailProps>;
  export const TagPage: React.FC<import('@/pages/types').ThemeTagPageProps>;
  export const Search: React.FC<import('@/pages/types').ThemeSearchProps>;
  export const SearchDetail: React.FC<
    import('@/pages/types').ThemeSearchDetailProps
  >;
  export const SearchPage: React.FC<
    import('@/pages/types').ThemeSearchPageProps
  >;
  export const Slug: React.FC<import('@/pages/types').ThemePrefixProps>;
  export const PrefixSlug: React.FC<
    import('@/pages/types').ThemePrefixSlugProps
  >;
  export const PageNotFound: React.FC<
    import('@/pages/types').ThemePageNotFoundProps
  >;
}
