# Environment Variables

## Base variables

`NEXT_PUBLIC_NOTION_PAGE_ID` (required): The Notion page ID. The ID of the Notion page you previously shared to the web, usually has 32 digits after your workspace address

`NEXT_PUBLIC_THEMES`: The theme list of the site, can be directory name in `themes` folder, e.g. 'nobelium,material'. The first theme will be the default theme. If not set, the theme list is all themes in `themes` folder, and the default may be the random theme.

`NEXT_PUBLIC_BASE_URL`: The base URL of the site, like "https://gaotian.net" , for generating sitemap feed and other links. If not set, the default value is current host.

## Algolia Search

`ALGOLIA_ADMIN_API_KEY`: The Algolia admin app key. **Do not expose this key in the code.**

`NEXT_PUBLIC_ALGOLIA_APP_ID`: The Algolia app ID.

`NEXT_PUBLIC_ALGOLIA_SEARCH_ONLY_APP_KEY`: The Algolia search only app key.

`NEXT_PUBLIC_ALGOLIA_INDEX`: The Algolia index name.
