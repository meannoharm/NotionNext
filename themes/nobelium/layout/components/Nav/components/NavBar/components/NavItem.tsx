import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRef } from 'react';

import type { FC } from 'react';
import type { Nav } from '@/types/notion';
import { Menu } from './Menu';

export interface NavItemProps {
  link: Nav;
}
export const NavItem: FC<NavItemProps> = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation('nav');

  const toggleShow = () => {
    setIsOpen(!isOpen);
  };

  if (!link || !link.show) {
    return null;
  }

  const hasSubMenu = link.subMenus && link?.subMenus.length > 0;

  return (
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
            {link?.icon && (
              <div className="mr-2">
                <i className={link?.icon} />
              </div>
            )}
            <span className="font-medium">{link?.title}</span>
            <i
              className={`fas fa-chevron-down ml-2 transition-all duration-200 ${isOpen ? ' rotate-180' : ''}`}
            ></i>
          </div>
        ) : (
          <Link
            className={`block text-black dark:text-gray-50`}
            href={link?.to}
          >
            {link?.icon && <i className={link?.icon} />}{' '}
            <span className="font-medium">{t(link.title)}</span>
          </Link>
        )}
      </div>
      {hasSubMenu && (
        <Menu
          className="absolute right-4 top-10 w-60"
          menuList={link.subMenus as Nav[]}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          excludeRef={menuRef}
        />
      )}
    </div>
  );
};
