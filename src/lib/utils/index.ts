export * from './getEnvironmentVariable';
export const isProduct = () => process.env.VERCEL_ENV === 'product';

/**
 * 判断是否客户端
 * @returns {boolean}
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * 加载外部资源
 * @param url 地址 例如 https://xx.com/xx.js
 * @param type js 或 css
 * @returns {Promise<string>}
 */
export function loadExternalResource(
  url: string,
  type: 'css' | 'font' | 'js',
): Promise<string> {
  // 检查是否已存在
  const elements =
    type === 'js'
      ? document.querySelectorAll(`[src='${url}']`)
      : document.querySelectorAll(`[href='${url}']`);

  return new Promise((resolve, reject) => {
    if (elements.length > 0 || !url) {
      resolve(url);
      return;
    }

    let tag;

    if (type === 'css') {
      tag = document.createElement('link');
      tag.rel = 'stylesheet';
      tag.href = url;
    } else if (type === 'font') {
      tag = document.createElement('link');
      tag.rel = 'preload';
      tag.as = 'font';
      tag.href = url;
    } else if (type === 'js') {
      tag = document.createElement('script');
      tag.src = url;
    }
    if (tag) {
      tag.onload = () => {
        console.log('Load Success', url);
        resolve(url);
      };
      tag.onerror = () => {
        console.log('Load Error', url);
        reject(url);
      };
      document.head.appendChild(tag);
    }
  });
}

/**
 * 查询url中的query参数
 * @param {}} variable
 * @returns
 */
export function getQueryVariable(key: string) {
  const query = isBrowser ? window.location.search.substring(1) : '';
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return false;
}
/**
 * 是否可迭代
 * @param {*} obj
 * @returns
 */
export function isIterable(obj: any) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

/**
 * 延时
 * @param {*} ms
 * @returns
 */
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 判断是否移动设备
 */
export const isMobile = () => {
  let isMobile = false;
  if (!isBrowser) {
    return isMobile;
  }

  // 这个判断会引发 TypeError: navigator.userAgentData.mobile is undefined 问题，导致博客无法正常工作
  // if (!isMobile && navigator.userAgentData.mobile) {
  //   isMobile = true
  // }

  if (!isMobile && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    isMobile = true;
  }

  if (/Android|iPhone|iPad|iPod/i.test(navigator.platform)) {
    isMobile = true;
  }

  if (typeof window.orientation !== 'undefined') {
    isMobile = true;
  }

  return isMobile;
};

export function isUrl(website: string) {
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return urlPattern.test(website);
}

export function isEmoji(str: string) {
  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  return emojiRegex.test(str);
}

export function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}
