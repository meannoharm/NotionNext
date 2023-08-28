import { useGlobal } from '@/lib/global';
import { saveDarkModeToCookies } from '@/themes/theme';
import { Moon, Sun } from './HeroIcons';
import { useImperativeHandle } from 'react';

/**
 * 深色模式按钮
 */
const DarkModeButton = (props) => {
  const { cRef, className } = props;
  const { isDarkMode, updateDarkMode } = useGlobal();

  /**
   * 对外暴露方法
   */
  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        handleChangeDarkMode();
      },
    };
  });

  // 用户手动设置主题
  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode;
    saveDarkModeToCookies(newStatus);
    updateDarkMode(newStatus);
    const htmlElement = document.getElementsByTagName('html')[0];
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark');
    htmlElement.classList?.add(newStatus ? 'dark' : 'light');
  };

  return (
    <div
      onClick={handleChangeDarkMode}
      className={`${
        className || ''
      } flex h-10 w-10 items-center justify-center rounded-full text-gray-800 hover:bg-black hover:bg-opacity-10 dark:text-gray-200 dark:hover:bg-white dark:hover:bg-opacity-10`}
    >
      <div id="darkModeButton" className=" h-5 w-5 transform cursor-pointer ">
        {' '}
        {isDarkMode ? <Sun /> : <Moon />}
      </div>
    </div>
  );
};
export default DarkModeButton;
