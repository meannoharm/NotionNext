import store from 'store';
import { isBrowser } from '../utils';

/**
 * 读取默认主题
 * @returns {*}
 */
export const loadThemeFromLocalStorage = () => {
  return store.get('theme');
};

/**
 * 保存默认主题
 * @param newTheme
 */
export const saveThemeToLocalStorage = (newTheme: string) => {
  store.set('theme', newTheme);
};

/**
 * 切换主题时的特殊处理
 * @param {*} setTheme
 */
export const initTheme = () => {
  if (isBrowser) {
    setTimeout(() => {
      const elements = document.querySelectorAll('[id^="theme-"]');
      if (elements?.length > 1) {
        elements[elements.length - 1].scrollIntoView();
        // 删除前面的元素，只保留最后一个元素
        for (let i = 0; i < elements.length - 1; i++) {
          elements[i]?.parentNode?.removeChild(elements[i]);
        }
      }
    }, 500);
  }
};
