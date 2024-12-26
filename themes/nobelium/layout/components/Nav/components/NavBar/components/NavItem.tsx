import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRef } from 'react';

import type { FC } from 'react';
import type { Nav } from '@/types/notion';
import { Menu } from './Menu';

export interface NavItemProps {
  nav: Nav;
}
export const NavItem: FC<NavItemProps> = ({ nav }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation('nav');

  const toggleShow = () => {
    setIsOpen(!isOpen);
  };

  if (!nav || !nav.show) {
    return null;
  }

  const hasSubMenu = nav.subMenus && nav?.subMenus.length > 0;

  return nav.show ? (
    <div className="relative">
      <div
        className="cursor-pointer rounded-full px-4 py-2 text-gray-800 hover:bg-gray-200/40 dark:text-gray-200 dark:hover:bg-gray-800/40"
        ref={menuRef}
      >
        {hasSubMenu ? (
          <div
            className={`flex items-center text-black dark:text-gray-50`}
            onClick={toggleShow}
          >
            {nav?.icon && (
              <div className="mr-2">
                <i className={nav?.icon} />
              </div>
            )}
            <span className="font-medium">{nav?.title}</span>
            <i
              className={`fas fa-chevron-down ml-2 transition-all duration-200 ${isOpen ? ' rotate-180' : ''}`}
            ></i>
          </div>
        ) : (
          <Link className={`block text-black dark:text-gray-50`} href={nav?.to}>
            {nav?.icon && <i className={nav?.icon} />}{' '}
            <span className="font-medium">{t(nav.title)}</span>
          </Link>
        )}
      </div>
      {hasSubMenu && (
        <Menu
          className="absolute right-4 top-10 w-60"
          menuList={nav.subMenus as Nav[]}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          excludeRef={menuRef}
        />
      )}
    </div>
  ) : null;
};
