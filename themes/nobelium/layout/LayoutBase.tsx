import { Transition } from '@headlessui/react';
import { useGlobal } from '@/lib/global';
import CommonHead from '@/components/CommonHead';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import JumpToTopButton from '../components/JumpToTopButton';
import { NobeliumStoreProvider } from '../providers';

import type { FC, ReactNode } from 'react';
import type { BaseThemeProps } from '@/pages/types';

export interface LayoutBaseProps extends BaseThemeProps {
  topSlot?: ReactNode;
  children: ReactNode;
}

/**
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase: FC<LayoutBaseProps> = (props) => {
  const { children, topSlot, pageMeta } = props;

  const { onLoading } = useGlobal();

  return (
    <NobeliumStoreProvider>
      <div
        id="theme-nobelium"
        className="nobelium relative flex h-screen w-screen flex-col bg-white dark:bg-black dark:text-gray-300"
      >
        {/* SEO相关 */}
        <CommonHead pageMeta={pageMeta} />

        {/* 顶部导航栏 */}
        <Nav />

        {/* 主区 */}
        <main
          id="out-wrapper"
          className="relative max-w-2xl flex-grow px-4 transition-all"
        >
          <Transition
            show={!onLoading}
            appear={true}
            enter="transition ease-in-out duration-700 transform order-first"
            enterFrom="opacity-0 translate-y-16"
            enterTo="opacity-100"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-16"
            unmount={false}
          >
            {/* 顶部插槽 */}
            {topSlot}
            {children}
          </Transition>
        </main>

        {/* 页脚 */}
        <Footer />

        {/* 右下悬浮 */}
        <div className="fixed bottom-4 right-4">
          <JumpToTopButton />
        </div>
      </div>
    </NobeliumStoreProvider>
  );
};

export default LayoutBase;
