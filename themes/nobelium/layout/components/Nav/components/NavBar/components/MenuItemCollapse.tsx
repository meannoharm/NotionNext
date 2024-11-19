import Collapse from '@/components/Collapse';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

import type { FC } from 'react';
import type { Nav } from '@/types/notion';

export interface MenuItemCollapseProps {
  link: Nav;
  onHeightChange?: (params: { height: number }) => void;
}

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse: FC<MenuItemCollapseProps> = (props) => {
  const { link } = props;
  const [isOpen, changeIsOpen] = useState(false);
  const { t } = useTranslation('nav');

  const hasSubMenu = link?.subMenus?.length && link?.subMenus?.length > 0;

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen);
  };

  if (!link || !link.show) {
    return null;
  }

  return (
    <>
      {!hasSubMenu && (
        <Link
          href={link?.to}
          target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
          className="cursor flex p-3 text-gray-800 transition-all duration-200  hover:bg-gray-200  dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {link?.icon && (
            <div className="mr-2">
              <i className={link.icon} />
            </div>
          )}
          <div className="font-medium">{t(link.name)}</div>
        </Link>
      )}
      {hasSubMenu && (
        <div
          onClick={hasSubMenu ? toggleOpenSubMenu : undefined}
          className="flex cursor-pointer justify-center px-4 dark:text-gray-200 "
        >
          {link?.icon && (
            <div className="mr-2">
              <i className={link.icon} />
            </div>
          )}
          <div className="mr-auto">{link?.name}</div>
          <div className="flex items-center">
            {isOpen ? (
              <i className="fa fa-minus" />
            ) : (
              <i className="fa fa-plus" />
            )}
          </div>
        </div>
      )}
      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
          <div className="flex flex-col">
            {link.subMenus &&
              link.subMenus.map((sLink) => {
                return (
                  <Link
                    key={sLink.id}
                    href={sLink.to}
                    target={
                      link?.to?.indexOf('http') === 0 ? '_blank' : '_self'
                    }
                    className="mt-2 px-12 font-medium"
                  >
                    {sLink.title}
                  </Link>
                );
              })}
          </div>
        </Collapse>
      )}
    </>
  );
};
