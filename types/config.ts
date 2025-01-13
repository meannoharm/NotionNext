import type {
  BooleanString,
  InputPosition,
  Loading,
  Mapping,
} from '@giscus/react';

export type SiteConfig = {
  AUTHOR: string;
  SUB_PATH: string;
  KEYWORDS: string;
  SINCE: number;
  LICENSE: string;
  LICENSE_URL: string;

  EMAIL: string;
  GITHUB_URL: string;

  POST_URL_PREFIX: string;
  POST_URL_PREFIX_MAPPING_CATEGORY?: Record<string, string>;
  IMG_LAZY_LOAD_PLACEHOLDER: string;
  POSTS_PER_PAGE: number;
  POST_LIST_STYLE: 'page' | 'scroll';
  POSTS_SORT_BY: 'date' | 'notion';
  POST_LIST_PREVIEW: boolean;
  POST_PREVIEW_LINES: number;
  ENABLE_RSS: boolean;
  CAN_NOT_COPY: boolean;
  THEME_SWITCH: boolean;
  DEBUG: boolean;
  CUSTOM_RIGHT_CLICK_CONTEXT_MENU: boolean;

  POST_SHARE_BAR_ENABLE: boolean;
  POSTS_SHARE_SERVICES: string;

  NEXT_REVALIDATE_SECOND: number;

  // Facebook
  FACEBOOK_APP_ID: string;
  FACEBOOK_PAGE: string;
  FACEBOOK_PAGE_TITLE: string;

  // analytics ackee
  ACKEE_ENABLE: boolean;
  ACKEE_JS: string;
  ACKEE_DATA_SERVER: string;
  ACKEE_DOMAIN_ID: string;

  // vercel speed insights
  VERCEL_SPEED_INSIGHTS_ENABLE: boolean;

  // vercel analytics
  VERCEL_ANALYTICS_ENABLE: boolean;

  // google analytics
  GOOGLE_ANALYTICS_ENABLE: boolean;
  GOOGLE_ANALYTICS_ID: string;

  // google adsense
  GOOGLE_ADSENSE_ENABLE: boolean;
  GOOGLE_ADSENSE_ID: string;
  GOOGLE_ADSENSE_TEST: 'on' | 'off';
  GOOGLE_ADSENSE_SLOT_IN_ARTICLE: string;
  GOOGLE_ADSENSE_SLOT_FLOW: string;
  GOOGLE_ADSENSE_SLOT_NATIVE: string;
  GOOGLE_ADSENSE_SLOT_AUTO: string;

  // SEO
  SEO_GOOGLE_SITE_VERIFICATION: string;
  SEO_BAIDU_SITE_VERIFICATION: string;

  // comment artalk https://artalk.js.org
  ARTALK_ENABLE: boolean;
  ARTALK_SERVER: string;

  // comment cusdis https://cusdis.com/
  CUSDIS_ENABLE: boolean;
  CUSDIS_APP_ID: string;
  CUSDIS_HOST: string;
  CUSDIS_BASE: string;

  // commen giscus https://giscus.app
  GISCUS_ENABLE: boolean;
  GISCUS_REPO: `${string}/${string}`;
  GISCUS_REPO_ID: string;
  GISCUS_CATEGORY_ID: string;
  GISCUS_MAPPING: Mapping;
  GISCUS_REACTIONS_ENABLED: BooleanString;
  GISCUS_EMIT_METADATA: BooleanString;
  GISCUS_INPUT_POSITION: InputPosition;
  GISCUS_LOADING: Loading;

  // comment gitalk https://gitalk.github.io/
  GITALK_ENABLE: boolean;
  GITALK_CLIENT_ID: string;
  GITALK_CLIENT_SECRET: string;
  GITALK_REPO: string;
  GITALK_OWNER: string;
  GITALK_ADMIN: string[];
  GITALK_DISTRACTION_FREE_MODE: boolean;

  // comment twikoo https://twikoo.js.org
  TWIKOO_ENABLE: boolean;
  TWIKOO_CDN: string;
  TWIKOO_ID: string;

  // comment utterances https://utteranc.es/
  UTTERANCES_ENABLE: boolean;
  UTTERANCES_REPO: string;

  // comment valine https://valine.js.org
  VALINE_ENABLE: boolean;
  VALINE_CDN: string;
  VALINE_APP_ID: string;
  VALINE_APP_KEY: string;
  VALINE_SERVER_URLS: string;

  // comment waline https://waline.js.org
  WALINE_ENABLE: boolean;
  WALINE_SERVER_URL: string;
};

export const siteConfig = (config: SiteConfig): SiteConfig => {
  return config;
};
