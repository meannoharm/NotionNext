import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import type { Nav } from '@/types';
import type { FC } from 'react';

export interface NavButtonProps {
  nav: Nav;
}

const NavButton: FC<NavButtonProps> = ({ nav }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
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
      <Menu
        id={nav.id}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default NavButton;
