import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BLOG from 'blog.config';
import CONFIG from '../../theme.config';
import { SvgIcon } from '../SvgIcon';
import { MenuItemDrop } from '../MenuItemDrop';
import Collapse from '@/components/Collapse';
import { MenuItemCollapse } from '../MenuItemCollapse';
import LazyImage from '@/components/LazyImage';
import DarkModeButton from '../DarkModeButton';
import RandomPostButton from '../RandomPostButton';
import SearchButton from '../SearchButton';
import LanguageSwitchButton from '../LanguageSwitchButton';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import { useNobeliumStore } from '../../providers';
import styles from './Nav.module.css';

import type { FC } from 'react';
import type { NavLink } from '../../types';
import type { CollapseHandle } from '@/components/Collapse';

const Nav: FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { siteInfo } = useNobeliumStore((state) => state);

  const handler: IntersectionObserverCallback = ([entry]) => {
    if (navRef && navRef.current) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add(styles.stickyNavFull);
      } else {
        navRef.current?.classList.remove(styles.stickyNavFull);
      }
    } else {
      navRef.current?.classList.add('remove-sticky');
    }
  };

  useEffect(() => {
    const observer = new window.IntersectionObserver(handler);
    const sentinelRefCurrent = sentinelRef.current;
    if (sentinelRefCurrent) observer.observe(sentinelRefCurrent);
    return () => {
      if (sentinelRefCurrent) observer.unobserve(sentinelRefCurrent);
    };
  }, [sentinelRef]);

  return (
    <>
      <div className="h-4 md:h-12" ref={sentinelRef} />
      <div
        className={`${styles.stickyNav} m-auto mb-2 flex h-6 w-full max-w-3xl flex-row items-center justify-between bg-opacity-60 px-4 py-8 md:mb-12`}
        ref={navRef}
      >
        <Link
          className="flex items-center rounded-full px-3 py-2 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
          href="/"
          aria-label={BLOG.TITLE}
        >
          <div className="h-6 w-6">
            {/* <SvgIcon/> */}
            {CONFIG.NAV_NOTION_ICON ? (
              <LazyImage
                src={siteInfo?.icon}
                width={24}
                height={24}
                alt={BLOG.AUTHOR}
              />
            ) : (
              <SvgIcon />
            )}
          </div>
          <p
            className={`${styles.headerName} ml-2 overflow-hidden font-medium text-gray-800 dark:text-gray-300`}
          >
            {siteInfo?.title}
          </p>
        </Link>
        <NavBar />
      </div>
    </>
  );
};

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
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-800 hover:bg-black hover:bg-opacity-10 dark:text-gray-200 dark:hover:bg-white dark:hover:bg-opacity-10"
        >
          <i className="fas fa-bars"></i>
        </div>

        <div
          ref={mobileMenuRef}
          className={`${isOpen ? 'block' : 'hidden'} absolute right-0 w-40 rounded border border-gray-100 bg-white drop-shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-black`}
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

export default Nav;
