export interface PageProps {
  meta: Meta;
}

export interface Meta {
  title: string;
  description: string;
  image: string;
  slug: string;
  type: string;
}

declare module '@theme-components' {
  export const Component: any;
}
