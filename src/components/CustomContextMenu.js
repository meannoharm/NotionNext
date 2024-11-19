import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useGlobal } from '@/context/global';
import { THEMES } from '@/lib/theme';
import { saveDarkModeToLocalStorage } from '@/lib/darkMode';
import BLOG from 'blog.config';
import useWindowSize from '@/hooks/useWindowSize';
import { useTranslation } from 'next-i18next';

/**
 * 自定义右键菜单
 * @param {*} props
 * @returns
 */
export default function CustomContextMenu(props) {
  const [position, setPosition] = useState({ x: '0px', y: '0px' });
  const [show, setShow] = useState(false);
  const { isDarkMode, setIsDarkMode } = useGlobal();
  const menuRef = useRef(null);
  const windowSize = useWindowSize();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const { latestPosts } = props;
  const router = useRouter();
  const { t } = useTranslation('menu');
  /**
   * 随机跳转文章
   */
  function handleJumpToRandomPost() {
    const randomIndex = Math.floor(Math.random() * latestPosts.length);
    const randomPost = latestPosts[randomIndex];
    router.push(`${BLOG.SUB_PATH}/${randomPost?.slug}`);
  }

  useLayoutEffect(() => {
    setWidth(menuRef.current.offsetWidth);
    setHeight(menuRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      // 计算点击位置加菜单宽高是否超出屏幕，如果超出则贴边弹出
      const x =
        event.clientX < windowSize.width - width
          ? event.clientX
          : windowSize.width - width;
      const y =
        event.clientY < windowSize.height - height
          ? event.clientY
          : windowSize.height - height;
      setPosition({ y: `${y}px`, x: `${x}px` });
      setShow(true);
    };

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, [windowSize]);

  function handleBack() {
    window.history.back();
  }

  function handleForward() {
    window.history.forward();
  }

  function handleRefresh() {
    window.location.reload();
  }

  function handleScrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShow(false);
  }

  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('页面地址已复制');
      })
      .catch((error) => {
        console.error('复制页面地址失败:', error);
      });
    setShow(false);
  }

  /**
   * 切换主题
   */
  function handeChangeTheme() {
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)]; // 从THEMES数组中 随机取一个主题
    const query = router.query;
    query.theme = randomTheme;
    router.push({ pathname: router.pathname, query });
  }

  function handleChangeDarkMode() {
    const newStatus = !isDarkMode;
    saveDarkModeToLocalStorage(newStatus);
    setIsDarkMode(newStatus);
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark');
    htmlElement.classList?.add(newStatus ? 'dark' : 'light');
  }

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className={`${show ? '' : 'invisible opacity-0'} fixed z-50 select-none transition-opacity duration-200`}
    >
      {/* 菜单内容 */}
      <div className="w-52 flex-col rounded-xl border bg-white p-3 drop-shadow-lg transition-colors duration-300 dark:border-gray-600 dark:bg-[#040404] dark:text-gray-200 dark:hover:border-yellow-600">
        {/* 顶部导航按钮 */}
        <div className="flex justify-between">
          <i
            onClick={handleBack}
            className="fa-solid fa-arrow-left w-8 cursor-pointer rounded px-2 py-2 text-center hover:bg-blue-600 hover:text-white"
          ></i>
          <i
            onClick={handleForward}
            className="fa-solid fa-arrow-right w-8 cursor-pointer rounded px-2 py-2 text-center hover:bg-blue-600 hover:text-white"
          ></i>
          <i
            onClick={handleRefresh}
            className="fa-solid fa-rotate-right w-8 cursor-pointer rounded px-2 py-2 text-center hover:bg-blue-600 hover:text-white"
          ></i>
          <i
            onClick={handleScrollTop}
            className="fa-solid fa-arrow-up w-8 cursor-pointer rounded px-2 py-2 text-center hover:bg-blue-600 hover:text-white"
          ></i>
        </div>

        <hr className="my-2 border-dashed" />

        {/* 跳转导航按钮 */}
        <div className="w-full px-2">
          <div
            onClick={handleJumpToRandomPost}
            title={t('walk-around')}
            className="flex h-10 w-full cursor-pointer flex-nowrap items-center justify-start rounded-lg px-2 transition-all duration-200 hover:bg-blue-600 hover:text-white"
          >
            <i className="fa-solid fa-podcast mr-2" />
            <div className="whitespace-nowrap">{t('walk-around')}</div>
          </div>

          <Link
            href="/category"
            title={t('category')}
            className="flex h-10 w-full cursor-pointer flex-nowrap items-center justify-start rounded-lg px-2 transition-all duration-200 hover:bg-blue-600 hover:text-white"
          >
            <i className="fa-solid fa-square-minus mr-2" />
            <div className="whitespace-nowrap">{t('category')}</div>
          </Link>

          <Link
            href="/tag"
            title={t('tags')}
            className="flex h-10 w-full cursor-pointer flex-nowrap items-center justify-start rounded-lg px-2 transition-all duration-200 hover:bg-blue-600 hover:text-white"
          >
            <i className="fa-solid fa-tag mr-2" />
            <div className="whitespace-nowrap">{t('tags')}</div>
          </Link>
        </div>

        <hr className="my-2 border-dashed" />

        {/* 功能按钮 */}
        <div className="w-full px-2">
          <div
            onClick={handleCopyLink}
            title={t('copy-url')}
            className="flex h-10 w-full cursor-pointer flex-nowrap items-center justify-start rounded-lg px-2 transition-all duration-200 hover:bg-blue-600 hover:text-white"
          >
            <i className="fa-solid fa-arrow-up-right-from-square mr-2" />
            <div className="whitespace-nowrap">{t('copy-url')}</div>
          </div>

          <div
            onClick={handleChangeDarkMode}
            title={isDarkMode ? t('light-mode') : t('dark-mode')}
            className="flex h-10 w-full cursor-pointer flex-nowrap items-center justify-start rounded-lg px-2 transition-all duration-200 hover:bg-blue-600 hover:text-white"
          >
            {isDarkMode ? (
              <i className="fa-regular fa-sun mr-2" />
            ) : (
              <i className="fa-regular fa-moon mr-2" />
            )}
            <div className="whitespace-nowrap">
              {' '}
              {isDarkMode ? t('light-mode') : t('dark-mode')}
            </div>
          </div>
          <div
            onClick={handeChangeTheme}
            title={t('theme-switch')}
            className="flex h-10 w-full cursor-pointer flex-nowrap items-center justify-start rounded-lg px-2 transition-all duration-200 hover:bg-blue-600 hover:text-white"
          >
            <i className="fa-solid fa-palette mr-2" />
            <div className="whitespace-nowrap">{t('theme-switch')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
