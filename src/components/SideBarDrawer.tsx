import { useRouter } from 'next/router';
import { useEffect } from 'react';

import type { FC } from 'react';

export interface SideBarDrawer {
  children: React.ReactNode;
  isOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * 侧边栏抽屉面板，可以从侧面拉出
 * @returns {JSX.Element}
 * @constructor
 */
const SideBarDrawer: FC<SideBarDrawer> = ({
  children,
  isOpen,
  onOpen,
  onClose,
  className,
}) => {
  const router = useRouter();
  useEffect(() => {
    const sideBarDrawerRouteListener = () => {
      switchSideDrawerVisible(false);
    };
    router.events.on('routeChangeComplete', sideBarDrawerRouteListener);
    return () => {
      router.events.off('routeChangeComplete', sideBarDrawerRouteListener);
    };
  }, [router.events]);

  // 点击按钮更改侧边抽屉状态
  const switchSideDrawerVisible = (showStatus: boolean) => {
    if (showStatus) {
      if (onOpen) onOpen();
    } else {
      if (onClose) onClose();
    }
    const sideBarDrawer = window.document.getElementById('sidebar-drawer');
    const sideBarDrawerBackground = window.document.getElementById(
      'sidebar-drawer-background',
    );

    if (showStatus) {
      sideBarDrawer?.classList.replace('-ml-60', 'ml-0');
      sideBarDrawerBackground?.classList.replace('hidden', 'block');
    } else {
      sideBarDrawer?.classList.replace('ml-0', '-ml-60');
      sideBarDrawerBackground?.classList.replace('block', 'hidden');
    }
  };

  return (
    <div id="sidebar-wrapper" className={' top-0 block lg:hidden ' + className}>
      <div
        id="sidebar-drawer"
        className={`${isOpen ? 'visible ml-0 w-60' : 'invisible -ml-60 max-w-side'} scroll-hidden fixed left-0 top-0 z-30 flex h-full flex-col overflow-y-scroll bg-white shadow-lg shadow-black duration-300 dark:bg-gray-900`}
      >
        {children}
      </div>

      {/* 背景蒙版 */}
      <div
        id="sidebar-drawer-background"
        onClick={() => {
          switchSideDrawerVisible(false);
        }}
        className={`${isOpen ? 'block' : 'hidden'} animate__animated animate__fadeIn fixed left-0 top-0 z-20 h-full w-full bg-black/70 duration-300`}
      />
    </div>
  );
};
export default SideBarDrawer;
