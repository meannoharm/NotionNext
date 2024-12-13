import {
  clientSideGetEnv,
  serverSideGetEnv,
} from '@/lib/utils';

export const NOTION_PAGE_ID = clientSideGetEnv(
  'NOTION_PAGE_ID',
  process.env.NEXT_PUBLIC_NOTION_PAGE_ID,
);
export const SITE_URL = clientSideGetEnv(
  'NEXT_PUBLIC_SITE_URL',
  process.env.NEXT_PUBLIC_SITE_URL,
);

// CDN
export const CDN_BASE = 'https://cdnjs.cloudflare.com/ajax/libs';
export const FONT_AWESOME = `${CDN_BASE}/font-awesome/6.6.0/css/all.min.css`;
export const PRISM_JS_LANGUAGE_PATH = `${CDN_BASE}/prism/1.29.0/components/`;
export const MERMAID_CDN = `${CDN_BASE}/mermaid/11.4.0/mermaid.min.js`;

export const NOTION_HOST = 'https://www.notion.so';
export const NOTION_ACCESS_TOKEN = serverSideGetEnv(
  'NOTION_ACCESS_TOKEN',
);

// Algolia
export const ALGOLIA_APPLICATION_ID = clientSideGetEnv(
  'ALGOLIA_APPLICATION_ID',
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  '',
);
export const ALGOLIA_SEARCH_API_KEY = clientSideGetEnv(
  'ALGOLIA_SEARCH_API_KEY',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY,
  '',
);
export const ALGOLIA_INDEX_NAME = clientSideGetEnv(
  'ALGOLIA_INDEX_NAME',
  process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  '',
);
export const ALGOLIA_ADMIN_API_KEY = serverSideGetEnv(
  'ALGOLIA_ADMIN_API_KEY',
  '',
);

// mailchimp
export const MAILCHIMP_API_KEY = serverSideGetEnv(
  'MAILCHIMP_API_KEY',
  '',
);
export const MAILCHIMP_LIST_ID = serverSideGetEnv(
  'MAILCHIMP_LIST_ID',
  '',
);

// for cache
export const ENABLE_CACHE = serverSideGetEnv(
  'ENABLE_CACHE',
  'true',
).toLowerCase() === 'true';
export const ENABLE_FILE_CACHE = serverSideGetEnv(
  'ENABLE_FILE_CACHE',
  'false',
).toLowerCase() === 'true';
export const MONGO_DB_URL = serverSideGetEnv(
  'MONGO_DB_URL',
  '',
);
export const MONGO_DB_NAME = serverSideGetEnv(
  'MONGO_DB_NAME',
  '',
);
