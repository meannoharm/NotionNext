import Collapse from '@/components/Collapse';
import Link from 'next/link';
import { useState } from 'react';

/**
 * 折叠菜单
 * @param {*} param0
 * @returns
 */
export const MenuItemCollapse = (props) => {
  const { link } = props;
  const [show, changeShow] = useState(false);
  const hasSubMenu = link?.subMenus?.length > 0;

  const [isOpen, changeIsOpen] = useState(false);

  const toggleShow = () => {
    changeShow(!show);
  };

  const toggleOpenSubMenu = () => {
    changeIsOpen(!isOpen);
  };

  if (!link || !link.show) {
    return null;
  }

  return (
    <>
      <div
        className="w-full px-4 py-2 text-left transition-all duration-200 hover:text-red-400  dark:border-black dark:bg-hexo-black-gray"
        onClick={toggleShow}
      >
        {!hasSubMenu && (
          <Link
            href={link?.to}
            target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
            className="flex  justify-between pb-1 pl-2 pr-4 font-extralight tracking-widest no-underline dark:text-gray-200"
          >
            <span className="items-center">
              {link?.icon && (
                <span className="mr-2">
                  <i className={link.icon} />
                </span>
              )}
              {link?.name}
            </span>
          </Link>
        )}
        {hasSubMenu && (
          <div
            onClick={hasSubMenu ? toggleOpenSubMenu : null}
            className="flex cursor-pointer items-center pb-1 pl-2 pr-4  font-extralight tracking-widest no-underline dark:text-gray-200"
          >
            <span className="mr-auto items-center">
              {link?.icon && (
                <span className="mr-2">
                  <i className={link.icon} />
                </span>
              )}
              {link?.name}
            </span>
            {isOpen ? <i className="fa fa-minus px-2" /> : <i className="fa fa-plus px-2" />}
          </div>
        )}
      </div>

      {/* 折叠子菜单 */}
      {hasSubMenu && (
        <Collapse isOpen={isOpen} onHeightChange={props.onHeightChange}>
          {link.subMenus.map((sLink) => {
            return (
              <div
                key={sLink.id}
                className="justify-start border-b bg-gray-50 text-left font-extralight tracking-widest transition-all duration-200 last:border-none hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-900"
              >
                <Link href={sLink.to} target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}>
                  <div className="px-10 py-3 pr-6  text-left text-xs">{sLink.title}</div>
                </Link>
              </div>
            );
          })}
        </Collapse>
      )}
    </>
  );
};
