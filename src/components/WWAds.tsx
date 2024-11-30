import BLOG from 'blog.config';
import Script from 'next/script';

/**
 * 万维广告插件
 * @param {string} orientation - 广告方向，可以是 'vertical' 或 'horizontal'
 * @param {boolean} sticky - 是否粘性定位
 * @returns {JSX.Element | null} - 返回渲染的 JSX 元素或 null
 */
export default function WWAds({
  orientation = 'vertical',
  sticky = false,
  className = '',
}: {
  orientation?: 'vertical' | 'horizontal';
  sticky?: boolean;
  className?: string;
}) {
  if (!BLOG.AD_WWADS_ID) {
    return null;
  }

  return (
    <>
      <div
        className={`wwads-cn ${orientation === 'vertical' ? 'wwads-vertical' : 'wwads-horizontal'} ${sticky ? 'wwads-sticky' : ''} z-30 ${className}`}
        data-id={BLOG.AD_WWADS_ID}
      ></div>
      <Script src="https://cdn.wwads.cn/js/makemoney.js" />
    </>
  );
}
