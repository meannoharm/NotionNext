import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import type { Nav } from '@/types';
import type { FC } from 'react';
import { useRouter } from 'next/router';

export interface NavButtonProps {
  nav: Nav;
}

const NavButton: FC<NavButtonProps> = ({ nav }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const hasSubMenu = nav.subMenus && nav?.subMenus.length > 0;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (hasSubMenu) {
      setAnchorEl(event.currentTarget);
    } else {
      router.push(nav.to);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        key={nav.id}
        onClick={handleClick}
        color="inherit"
        startIcon={nav.icon ? <i className={`${nav?.icon} block`} /> : null}
      >
        {nav.title}
      </Button>
      {hasSubMenu && (
        <Menu
          id={nav.id}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {nav.subMenus?.map((subNav) => (
            <MultiLevelMenuItem nav={subNav} key={subNav.id} />
          ))}
        </Menu>
      )}
    </>
  );
};

const MultiLevelMenuItem: FC<NavButtonProps> = ({ nav }) => {
  const [showSubMenu, setShowSubMenu] = React.useState(false);
  const router = useRouter();

  const hasSubMenu = nav.subMenus && nav?.subMenus.length > 0;

  const handleClick = () => {
    if (hasSubMenu) {
      setShowSubMenu(!showSubMenu);
    } else {
      router.push(nav.to);
    }
  };

  return (
    <>
      <MenuItem onClick={handleClick}>
        {nav.title}
        {hasSubMenu && (
          <i
            className={`fas fa-chevron-down ml-2 transition-all duration-200 ${showSubMenu ? ' rotate-180' : ''}`}
          ></i>
        )}
      </MenuItem>
      {hasSubMenu && showSubMenu && (
        <Box pl={2}>
          {nav.subMenus?.map((subNav) => (
            <MultiLevelMenuItem key={subNav.id} nav={subNav} />
          ))}
        </Box>
      )}
    </>
  );
};

export default NavButton;
