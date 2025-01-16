import { type FC, useMemo, useRef, useState } from 'react';
import CONFIG from '@/themes/nobelium/theme.config';
import { NavItem } from './NavItem';
import RandomPostButton from './RandomPostButton';
import SearchButton from './SearchButton';
import LanguageSwitchButton from './LanguageSwitchButton';
import DarkModeButton from './DarkModeButton';
import { Menu } from './Menu';
import { isEmpty } from 'lodash';
import { useSiteStore } from '@/providers/siteProvider';
import { useConfigStore } from '@/providers/configProvider';

import { PageType, type Nav } from '@/types';

const NavBar: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuToggleButtonRef = useRef(null);
  const customNav = useSiteStore((state) => state.navList);
  const ENABLE_RSS = useConfigStore((state) => state.ENABLE_RSS);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const navList: Nav[] = useMemo(
    () =>
      !isEmpty(customNav)
        ? customNav
        : [
            {
              id: 'rss',
              icon: 'fas fa-rss',
              title: 'rss',
              to: '/feed',
              show: !!(ENABLE_RSS && CONFIG.MENU_RSS),
              type: PageType.Link,
            },
            {
              id: 'search',
              icon: 'fas fa-search',
              title: 'search',
              to: '/search',
              show: CONFIG.MENU_SEARCH,
              type: PageType.Link,
            },
            {
              id: 'archive',
              icon: 'fas fa-archive',
              title: 'archive',
              to: '/archive',
              show: CONFIG.MENU_ARCHIVE,
              type: PageType.Link,
            },
            {
              id: 'category',
              icon: 'fas fa-folder',
              title: 'category',
              to: '/category',
              show: CONFIG.MENU_CATEGORY,
              type: PageType.Link,
            },
            {
              id: 'tags',
              icon: 'fas fa-tag',
              title: 'tags',
              to: '/tag',
              show: CONFIG.MENU_TAG,
              type: PageType.Link,
            },
          ],
    [CONFIG, ENABLE_RSS, customNav],
  );

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
