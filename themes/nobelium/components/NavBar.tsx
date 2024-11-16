import Collapse, { CollapseHandle } from '@/components/Collapse';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import BLOG from 'blog.config';
import { type FC, useRef, useState } from 'react';
import CONFIG from 'themes/nobelium/theme.config';
import { MenuItemDrop } from './MenuItemDrop';
import RandomPostButton from './RandomPostButton';
import SearchButton from './SearchButton';
import LanguageSwitchButton from './LanguageSwitchButton';
import DarkModeButton from './DarkModeButton';
import { MenuItemCollapse } from './MenuItemCollapse';

import type { NavLink } from 'themes/nobelium/types';

const NavBar: FC = () => {
  const [isOpen, changeOpen] = useState(false);
  const collapseRef = useRef<CollapseHandle>(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuToggleButtonRef = useRef(null);

  const toggleOpen = () => {
    changeOpen(!isOpen);
  };

  useToggleClickOutSide([mobileMenuRef, mobileMenuToggleButtonRef], () => {
    changeOpen(false);
  });

  const links: NavLink[] = [
    {
      id: 'rss',
      icon: 'fas fa-rss',
      name: 'rss',
      to: '/feed',
      show: !!(BLOG.ENABLE_RSS && CONFIG.MENU_RSS),
      target: '_blank',
    },
    {
      id: 'search',
      icon: 'fas fa-search',
      name: 'search',
      to: '/search',
      show: CONFIG.MENU_SEARCH,
    },
    {
      id: 'archive',
      icon: 'fas fa-archive',
      name: 'archive',
      to: '/archive',
      show: CONFIG.MENU_ARCHIVE,
    },
    {
      id: 'category',
      icon: 'fas fa-folder',
      name: 'category',
      to: '/category',
      show: CONFIG.MENU_CATEGORY,
    },
    {
      id: 'tags',
      icon: 'fas fa-tag',
      name: 'tags',
      to: '/tag',
      show: CONFIG.MENU_TAG,
    },
  ];

  return (
    <div className="flex flex-shrink-0">
      <ul className="hidden flex-row md:flex">
        {links.map((link) => (
          <MenuItemDrop key={link?.id} link={link} />
        ))}
      </ul>

      {CONFIG.MENU_RANDOM_POST && <RandomPostButton />}
      {CONFIG.MENU_SEARCH_BUTTON && <SearchButton />}
      {CONFIG.MENU_LANGUAGE_SWITCH && <LanguageSwitchButton />}
      {CONFIG.MENU_DARK_MODE_SWITCH && <DarkModeButton />}

      {/* 移动端菜单按钮 */}
      <div className="relative md:hidden">
        <div
          onClick={toggleOpen}
          ref={mobileMenuToggleButtonRef}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <i className="fas fa-bars"></i>
        </div>

        <div
          ref={mobileMenuRef}
          className={`${isOpen ? 'block' : 'hidden'} absolute right-0 w-40 rounded border border-gray-100 bg-white drop-shadow-lg transition-all duration-300 dark:border-gray-900 dark:bg-black`}
        >
          <Collapse collapseRef={collapseRef} isOpen={isOpen} type="vertical">
            {links.map((link) => (
              <MenuItemCollapse
                key={link.id}
                link={link}
                onHeightChange={collapseRef.current?.updateCollapseHeight}
              />
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
