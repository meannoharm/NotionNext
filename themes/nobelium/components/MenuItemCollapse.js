import Collapse from '@/components/Collapse';
import Link from 'next/link';
import { useState } from 'react';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import { useRef } from 'react';

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = (props) => {
  const { link } = props;
  const [isOpen, changeIsOpen] = useState(false);
  const menuRef = useRef();

  useToggleClickOutSide(menuRef, () => {
    changeIsOpen(false);
  });

  const hasSubMenu = link?.subMenus?.length > 0;

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen);
  };

  if (!link || !link.show) {
    return null;
  }

  return (
    <div className="mb-2 transition-all duration-200  last:mb-0 dark:border-black dark:bg-hexo-black-gray">
      {!hasSubMenu && (
        <Link
          href={link?.to}
          target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
          className="flex px-4 dark:text-gray-200 "
        >
          {link?.icon && (
            <div className="mr-2">
              <i className={link.icon} />
            </div>
          )}
          <div>{link?.name}</div>
        </Link>
      )}
      {hasSubMenu && (
        <div
          onClick={hasSubMenu ? toggleOpenSubMenu : null}
          className="flex cursor-pointer justify-center px-4 dark:text-gray-200 "
        >
          {link?.icon && (
            <div className="mr-2">
              <i className={link.icon} />
            </div>
          )}
          <div class="mr-auto">{link?.name}</div>
          <div class="flex items-center">
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
          <div class="flex flex-col">
            {link.subMenus.map((sLink) => {
              return (
                <Link
                  key={sLink.id}
                  href={sLink.to}
                  target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
                  class="mt-2 px-10"
                >
                  {sLink.title}
                </Link>
              );
            })}
          </div>
        </Collapse>
      )}
    </div>
  );
};
