import { useEffect, useRef } from 'react';
import Link from 'next/link';
import CONFIG from '@themes/nobelium/theme.config';
import { SvgIcon } from './components/SvgIcon';
import LazyImage from '@/components/LazyImage';
import NavBar from './components/NavBar/NavBar';
import styles from './Nav.module.css';
import { useSiteStore } from '@/providers/siteProvider';
import { useConfigStore } from '@/providers/configProvider';

import type { FC } from 'react';
import { useShallow } from 'zustand/react/shallow';

const Nav: FC = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const siteInfo = useSiteStore((state) => state.siteInfo);
  const { ENABLE_RSS, AUTHOR } = useConfigStore(
    useShallow((state) => ({
      ENABLE_RSS: state.ENABLE_RSS,
      AUTHOR: state.AUTHOR,
    })),
  );

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
          className="flex items-center rounded-full px-3 py-2 text-gray-800 hover:bg-gray-200/40 dark:text-gray-200 dark:hover:bg-gray-800/40"
          href="/"
          aria-label={siteInfo?.title}
        >
          <div className="h-6 w-6">
            {CONFIG.NAV_NOTION_ICON ? (
              <LazyImage
                src={siteInfo?.icon}
                width={24}
                height={24}
                alt={AUTHOR}
              />
            ) : (
              <SvgIcon />
            )}
          </div>
          <p
            className={`${styles.headerName} ml-2 overflow-hidden font-medium text-gray-800  dark:text-gray-200`}
          >
            {siteInfo?.title}
          </p>
        </Link>
        <NavBar />
      </div>
    </>
  );
};

export default Nav;
