import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BLOG from '@/blog.config';
import CONFIG from '../config';
import { SvgIcon } from './SvgIcon';
import { MenuItemDrop } from './MenuItemDrop';
import Collapse from '@/components/Collapse';
import { MenuItemCollapse } from './MenuItemCollapse';
import LazyImage from '@/components/LazyImage';
import DarkModeButton from './DarkModeButton';
import RandomPostButton from './RandomPostButton';
import SearchButton from './SearchButton';
import LanguageSwitchButton from './LanguageSwitchButton';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import { useTranslation } from 'next-i18next';

import type { FC } from 'react';
import type { NavLink } from '../types/nav';
import type { CollapseHandle } from '@/components/Collapse';

export interface NavProps {
  [key: string]: any;
}

const Nav: FC<NavProps> = (props) => {
  const { navBarTitle, fullWidth, siteInfo } = props;
  const navRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handler: IntersectionObserverCallback = ([entry]) => {
    if (navRef && navRef.current) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add('sticky-nav-full');
      } else {
        navRef.current?.classList.remove('sticky-nav-full');
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
      <div
        className="observer-element absolute top-0 h-4 md:h-12"
        ref={sentinelRef}
      ></div>
      <div
        className={`sticky-nav m-auto mb-2 flex h-6 w-full flex-row items-center justify-between bg-opacity-60 py-8 md:mb-12 ${
          !fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
        }`}
        id="sticky-nav"
        ref={navRef}
      >
        <Link className="flex items-center" href="/" aria-label={BLOG.TITLE}>
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
          {navBarTitle ? (
            <p className="header-name ml-2 font-medium text-gray-800 dark:text-gray-300">
              {navBarTitle}
            </p>
          ) : (
            <p className="header-name ml-2 font-medium text-gray-800 dark:text-gray-300">
              {siteInfo?.title}
              {/* ,{' '}<span className="font-normal">{siteInfo?.description}</span> */}
            </p>
          )}
        </Link>
        <NavBar {...props} />
      </div>
    </>
  );
};

export interface NavBarProps {
  [key: string]: any;
}

const NavBar: FC<NavBarProps> = (props) => {
  const { t } = useTranslation('nav');
  const { customMenu, customNav } = props;
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
      name: t('rss'),
      to: '/feed',
      show: !!(BLOG.ENABLE_RSS && CONFIG.MENU_RSS),
      target: '_blank',
    },
    {
      id: 'search',
      icon: 'fas fa-search',
      name: t('search'),
      to: '/search',
      show: CONFIG.MENU_SEARCH,
    },
    {
      id: 'archive',
      icon: 'fas fa-archive',
      name: t('archive'),
      to: '/archive',
      show: CONFIG.MENU_ARCHIVE,
    },
    {
      id: 'category',
      icon: 'fas fa-folder',
      name: t('category'),
      to: '/category',
      show: CONFIG.MENU_CATEGORY,
    },
    {
      id: 'tags',
      icon: 'fas fa-tag',
      name: t('tags'),
      to: '/tag',
      show: CONFIG.MENU_TAG,
    },
  ];

  // TODO 自定义菜单
  // if (customNav) {
  //   links = links.concat(customNav);
  // }

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-shrink-0">
      <ul className="hidden flex-row md:flex">
        {links.map((link) => (
          <MenuItemDrop key={link?.id} link={link} />
        ))}
      </ul>

      {/* 移动端使用的菜单 */}
      <div className="md:hidden" ref={mobileMenuRef}>
        <Collapse
          collapseRef={collapseRef}
          isOpen={isOpen}
          type="vertical"
          className="fixed right-6 top-16"
        >
          <div className="flex w-48 flex-col rounded border bg-white py-2 text-sm dark:border-black dark:bg-black">
            {links.map((link) => (
              <MenuItemCollapse
                key={link?.id}
                link={link}
                onHeightChange={collapseRef.current?.updateCollapseHeight}
              />
            ))}
          </div>
        </Collapse>
      </div>

      {CONFIG.MENU_RANDOM_POST && <RandomPostButton {...props} />}
      {CONFIG.MENU_SEARCH_BUTTON && <SearchButton {...props} />}
      <LanguageSwitchButton {...props} />
      <DarkModeButton />

      {/* 移动端菜单按钮 */}
      <div
        onClick={toggleOpen}
        ref={mobileMenuToggleButtonRef}
        className="flex h-10 w-10 cursor-pointer items-center justify-center md:hidden"
      >
        <i className="fas fa-bars"></i>
      </div>
    </div>
  );
};

export default Nav;
