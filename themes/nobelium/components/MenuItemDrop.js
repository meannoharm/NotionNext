import Link from 'next/link';
import { useState } from 'react';
import useToggleClickOutSide from '@/hooks/useToggleClickOutSide';
import { useRef } from 'react';

export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false);
  const menuRef = useRef(null);

  useToggleClickOutSide(menuRef, () => {
    changeShow(false);
  });

  const toggleShow = () => {
    changeShow(!show);
  };

  if (!link || !link.show) {
    return null;
  }

  const hasSubMenu = link?.subMenus?.length > 0;

  return (
    <div className="relative cursor-pointer px-3 py-2 " ref={menuRef}>
      {!hasSubMenu && (
        <div className="nav block text-black dark:text-gray-50">
          <Link
            href={link?.to}
            target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
          >
            {link?.icon && <i className={link?.icon} />} {link?.name}
          </Link>
        </div>
      )}

      {hasSubMenu && (
        <div
          className="nav block text-black dark:text-gray-50"
          onClick={toggleShow}
        >
          {link?.icon && <i className={link?.icon} />} {link?.name}
          <i
            className={`fas fa-chevron-down px-2 transition-all duration-500 ${show ? ' rotate-180' : ''}`}
          ></i>
        </div>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <div
          className={`${show ? 'visible top-10 opacity-100 ' : 'invisible top-8 opacity-0 '} absolute z-20 block w-40 rounded border border-gray-100 bg-white drop-shadow-lg transition-all duration-300 dark:border-gray-800 dark:bg-black`}
        >
          {link.subMenus.map((sLink) => {
            return (
              <div
                key={sLink.id}
                className="p-3 text-gray-700 transition-all duration-200  hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900"
              >
                <Link
                  href={sLink.to}
                  target={link?.to?.indexOf('http') === 0 ? '_blank' : '_self'}
                >
                  <span className="text-nowrap">
                    {link?.icon && <i className={sLink?.icon}> &nbsp; </i>}
                    {sLink.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
