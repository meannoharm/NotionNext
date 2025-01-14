const CONFIG = {
  NAV_NOTION_ICON: true, // 是否读取Notion图标作为站点头像 ; 否则默认显示黑色SVG方块

  // 特殊菜单
  MENU_RANDOM_POST: false, // 是否显示随机跳转文章按钮
  MENU_SEARCH_BUTTON: false, // 是否显示搜索按钮，该按钮支持Algolia搜索
  MENU_LANGUAGE_SWITCH: true,
  MENU_DARK_MODE_SWITCH: true,

  // 默认菜单配置 （开启自定义菜单后，以下配置则失效，请在Notion中自行配置菜单）
  MENU_CATEGORY: true, // 显示分类
  MENU_TAG: true, // 显示标签
  MENU_ARCHIVE: true, // 显示归档
  MENU_SEARCH: false, // 显示搜索
  MENU_RSS: false, // 显示订阅
};
export default CONFIG;
