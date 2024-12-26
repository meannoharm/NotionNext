import { Transition } from '@headlessui/react';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer';
import JumpToTopButton from './components/JumpToTopButton';
import { useStyleStore } from 'providers/styleProvider';

import type { FC, ReactNode } from 'react';

export interface LayoutBaseProps {
  topSlot?: ReactNode;
  children: ReactNode;
}

/**
 * @returns {JSX.Element}
 * @constructor
 */
const LayoutBase: FC<LayoutBaseProps> = (props) => {
  const { children } = props;

  const isLoading = useStyleStore((state) => state.isLoading);

  return (
    <div
      id="theme-nobelium"
      className="nobelium flex min-h-screen flex-col flex-nowrap items-stretch justify-start bg-white dark:bg-black dark:text-gray-300"
    >
      {/* 顶部导航栏 */}
      <Nav />

      {/* 主区 */}
      <main className="w-full max-w-2xl flex-grow self-center px-4 transition-all">
        <Transition
          show={!isLoading}
          appear={true}
          enter="transition ease-in-out duration-700 transform order-first"
          enterFrom="opacity-0 translate-y-16"
          enterTo="opacity-100"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-16"
          unmount={false}
        >
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
  );
};

export default LayoutBase;
