import { useGlobal } from '@/lib/global';
import React, { useEffect } from 'react';

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { locale } = useGlobal();
  const jumpToTopButtonRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollHandler = () => {
      if (jumpToTopButtonRef.current) {
        jumpToTopButtonRef.current.style.display =
          window.scrollY > 500 ? 'block' : 'none';
      }
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <div
      ref={jumpToTopButtonRef}
      title={locale.POST.TOP}
      className="cursor-pointer"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className="fas fa-angle-up text-2xl" />
    </div>
  );
};

export default JumpToTopButton;
