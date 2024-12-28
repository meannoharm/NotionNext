import { type FC, useRef, useState } from 'react';
import CONFIG from '@/themes/nobelium/theme.config';
import { NavItem } from './components/NavItem';
import RandomPostButton from './components/RandomPostButton';
import SearchButton from './components/SearchButton';
import LanguageSwitchButton from './components/LanguageSwitchButton';
import DarkModeButton from './components/DarkModeButton';
import { Menu } from './components/Menu';
import { isEmpty } from 'lodash';
import { useSiteStore } from 'providers/siteProvider';
import { useConfigStore } from 'providers/configProvider';

import type { Nav } from '@/types';

const NavBar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuToggleButtonRef = useRef(null);
  const customNav = useSiteStore((state) => state.navList);
  const ENABLE_RSS = useConfigStore((state) => state.ENABLE_RSS);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const navList: Nav[] = !isEmpty(customNav)
    ? customNav
    : [
        {
          id: 'rss',
          icon: 'fas fa-rss',
          title: 'rss',
          to: '/feed',
          show: !!(ENABLE_RSS && CONFIG.MENU_RSS),
        },
        {
          id: 'search',
          icon: 'fas fa-search',
          title: 'search',
          to: '/search',
          show: CONFIG.MENU_SEARCH,
        },
        {
          id: 'archive',
          icon: 'fas fa-archive',
          title: 'archive',
          to: '/archive',
          show: CONFIG.MENU_ARCHIVE,
        },
        {
          id: 'category',
          icon: 'fas fa-folder',
          title: 'category',
          to: '/category',
          show: CONFIG.MENU_CATEGORY,
        },
        {
          id: 'tags',
          icon: 'fas fa-tag',
          title: 'tags',
          to: '/tag',
          show: CONFIG.MENU_TAG,
        },
      ];

  return (
    <div className="flex flex-shrink-0">
      <ul className="hidden flex-row md:flex">
        {navList.map((link) => (
          <NavItem key={link?.id} nav={link} />
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
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-800 hover:bg-gray-200/40 dark:text-gray-200 dark:hover:bg-gray-800/40"
        >
          <i className="fas fa-bars"></i>
        </div>

        <Menu
          className="absolute right-0 w-60"
          menuList={navList}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          excludeRef={mobileMenuToggleButtonRef}
        />
      </div>
    </div>
  );
};

export default NavBar;
