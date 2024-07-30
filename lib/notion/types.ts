export type * from 'notion-types';

export interface PageProperties {
  id: string;
  type: PagePropertiesType;
  status: PagePropertiesStatus;
  category: string[];
  [key: string]: any;
}

export enum PagePropertiesType {
  Post = 'Post',
  Page = 'Page',
  Notice = 'Notice',
}

export enum PagePropertiesStatus {
  Published = 'Published',
  Invisible = 'Invisible',
  Draft = 'Draft',
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo: string;
}

export interface CustomNav {
  icon: string;
  name: string;
  to: string;
  target: string;
  show: boolean;
}

export interface SiteInfo {
  title: string;
  description: any;
  pageCover: any;
  icon: any;
}

export interface DataBaseInfo {}

export interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}
