import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

/**
 * 跳转到网页顶部
 * 当屏幕下滑500像素后会出现该控件
 * @param targetRef 关联高度的目标html标签
 * @param showPercent 是否显示百分比
 * @returns {JSX.Element}
 * @constructor
 */
const JumpToTopButton = () => {
  const { t } = useTranslation('common');
  const [isShowButton, setIsShowButton] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      if (window.scrollY > 500) {
        setIsShowButton(true);
      } else {
        setIsShowButton(false);
      }
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <div
      title={t('top')}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all ${isShowButton ? 'opacity-100' : 'opacity-0'} hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <i className="fas fa-angle-up text-2xl" />
    </div>
  );
};

export default JumpToTopButton;
