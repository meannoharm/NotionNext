import Collapse from '@/components/Collapse';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

import type { FC, RefObject } from 'react';
import type { Nav } from '@/types/notion';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';

export interface MenuProps {
  menuList: Nav[];
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  className?: string;
  clickOutSideClose?: boolean;
  excludeRef?: RefObject<HTMLDivElement>;
}

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const Menu: FC<MenuProps> = (props) => {
  const {
    menuList,
    isOpen,
    setIsOpen,
    excludeRef,
    clickOutSideClose = true,
    className,
  } = props;

  const menuRef = useRef<HTMLDivElement>(null);

  const refs = [menuRef];
  if (excludeRef) {
    refs.push(excludeRef);
  }

  useToggleClickOutSide(refs, () => {
    if (clickOutSideClose) {
      setIsOpen(false);
    }
  });

  return (
    <div
      ref={menuRef}
      className={`${isOpen ? 'block' : 'hidden'}  rounded border border-gray-100 bg-white drop-shadow transition-all duration-300 dark:border-gray-900 dark:bg-black ${className}`}
    >
      <MenuList menuList={menuList} isOpen={isOpen} />
    </div>
  );
};

const MenuList = ({
  menuList,
  isOpen,
}: {
  menuList: Nav[];
  isOpen: boolean;
}) => {
  return (
    <Collapse isOpen={isOpen}>
      {menuList.map((menu) => {
        if (menu.subMenus && menu.subMenus.length > 0) {
          return <SubMenuItem key={menu.id} menu={menu} />;
        } else {
          return <MenuItem key={menu.id} menu={menu} />;
        }
      })}
    </Collapse>
  );
};

const MenuItem = ({ menu }: { menu: Nav }) => {
  return (
    <Link
      href={menu.to}
      className="cursor flex p-3 text-gray-800 transition-all duration-200  hover:bg-gray-200  dark:text-gray-200 dark:hover:bg-gray-800"
    >
      {menu.icon && (
        <div className="mr-2">
          <i className={menu.icon} />
        </div>
      )}
      <div>{menu.title}</div>
    </Link>
  );
};

const SubMenuItem = ({ menu }: { menu: Nav }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <>
      <div
        onClick={toggleOpen}
        className="flex cursor-pointer p-3 text-gray-800 transition-all duration-200 hover:bg-gray-200/40 dark:text-gray-200 dark:hover:bg-gray-800/40"
      >
        {menu?.icon && (
          <div className="mr-2">
            <i className={menu.icon} />
          </div>
        )}
        <div>{menu.title}</div>
        <div className="ml-auto flex items-center">
          <i
            className={`fas fa-chevron-down transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}
          ></i>
        </div>
      </div>
      <div className="pl-4">
        {isOpen && menu.subMenus && (
          <MenuList menuList={menu.subMenus} isOpen={isOpen} />
        )}
      </div>
    </>
  );
};
