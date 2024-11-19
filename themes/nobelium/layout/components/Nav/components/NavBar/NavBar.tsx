import Collapse, { CollapseHandle } from '@/components/Collapse';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import BLOG from 'blog.config';
import { type FC, useRef, useState } from 'react';
import CONFIG from '@themes/nobelium/theme.config';
import { MenuItemDrop } from './components/MenuItemDrop';
import RandomPostButton from './components/RandomPostButton';
import SearchButton from './components/SearchButton';
import LanguageSwitchButton from './components/LanguageSwitchButton';
import DarkModeButton from './components/DarkModeButton';
import { MenuItemCollapse } from './components/MenuItemCollapse';
import { useNobeliumStore } from '@themes/nobelium/providers';
import { isEmpty } from 'lodash';

import type { Nav } from '@/types/notion';

const NavBar: FC = () => {
  const [isOpen, changeOpen] = useState(false);
  const collapseRef = useRef<CollapseHandle>(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuToggleButtonRef = useRef(null);
  const { navList } = useNobeliumStore((store) => store);

  const toggleOpen = () => {
    changeOpen(!isOpen);
  };

  useToggleClickOutSide([mobileMenuRef, mobileMenuToggleButtonRef], () => {
    changeOpen(false);
  });

  const links: Nav[] = !isEmpty(navList)
    ? navList
    : [
        {
          id: 'rss',
          icon: 'fas fa-rss',
          title: 'rss',
          to: '/feed',
          show: !!(BLOG.ENABLE_RSS && CONFIG.MENU_RSS),
          target: '_blank',
        },
        {
          id: 'search',
          icon: 'fas fa-search',
          title: 'search',
          to: '/search',
          show: CONFIG.MENU_SEARCH,
          target: '_self',
        },
        {
          id: 'archive',
          icon: 'fas fa-archive',
          title: 'archive',
          to: '/archive',
          show: CONFIG.MENU_ARCHIVE,
          target: '_self',
        },
        {
          id: 'category',
          icon: 'fas fa-folder',
          title: 'category',
          to: '/category',
          show: CONFIG.MENU_CATEGORY,
          target: '_self',
        },
        {
          id: 'tags',
          icon: 'fas fa-tag',
          title: 'tags',
          to: '/tag',
          show: CONFIG.MENU_TAG,
          target: '_self',
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
