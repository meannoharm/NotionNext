import { useGlobal } from '@/lib/global';
import React, { useState } from 'react';
import { Draggable } from './Draggable';
import { THEMES } from '@/theme';
import { useRouter } from 'next/router';
/**
 *
 * @returns 主题切换
 */
const ThemeSwitch = () => {
  const { theme } = useGlobal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // 修改当前路径url中的 theme 参数
  // 例如 http://localhost?theme=hexo 跳转到 http://localhost?theme=newTheme
  const onSelectChange = (e) => {
    setIsLoading(true);
    const newTheme = e.target.value;
    const query = router.query;
    query.theme = newTheme;
    router.push({ pathname: router.pathname, query }).then(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <Draggable>
        <div
          id="draggableBox"
          style={{ left: '10px', top: '80vh' }}
          className="fixed z-50 rounded-2xl bg-gray-50 drop-shadow-lg dark:bg-black dark:text-white"
        >
          <div className="group flex w-full items-center p-3 text-sm transition-all duration-200">
            <div className="w-0 overflow-hidden transition-all duration-200 group-hover:w-20">
              <select
                value={theme}
                onChange={onSelectChange}
                name="themes"
                className="cursor-pointer appearance-none bg-gray-50 uppercase outline-none dark:bg-black dark:text-white"
              >
                {THEMES?.map((t) => {
                  return (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  );
                })}
              </select>
            </div>
            <i className="fa-solid fa-palette pl-2"></i>
          </div>
        </div>
        {/* 切换主题加载时的全屏遮罩 */}
        <div
          className={`${isLoading ? 'opacity-50 ' : 'opacity-0'} shadow-text pointer-events-none fixed left-0 top-0 z-50 flex h-screen
                              w-screen items-center justify-center bg-black text-white shadow-inner transition-all duration-1000`}
        >
          <i className="fas fa-spinner mr-5 animate-spin text-3xl" />
        </div>
      </Draggable>
    </>
  );
};

export default ThemeSwitch;
