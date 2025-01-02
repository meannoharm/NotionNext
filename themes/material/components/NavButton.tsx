import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import type { Nav } from '@/types';
import type { FC } from 'react';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

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
        startIcon={nav.icon ? <i className={`${nav?.icon}`} /> : null}
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
          <List
            sx={{
              width: 360,
              bgcolor: 'background.paper',
            }}
            component="nav"
          >
            {nav.subMenus?.map((subNav) => (
              <MultiLevelMenuItem nav={subNav} key={subNav.id} />
            ))}
          </List>
        </Menu>
      )}
    </>
  );
};

const MultiLevelMenuItem: FC<{
  nav: Nav;
  sx?: Record<string, unknown>;
}> = ({ nav, sx = {} }) => {
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
      <ListItemButton onClick={handleClick} sx={{ ...sx }}>
        <ListItemIcon>
          {nav.icon && <i className={`${nav?.icon}`} />}
        </ListItemIcon>
        <ListItemText primary={nav.title} />
        {hasSubMenu && (
          <i
            className={`fas fa-chevron-down ml-2 transition-all duration-200 ${showSubMenu ? ' rotate-180' : ''}`}
          ></i>
        )}
      </ListItemButton>
      {hasSubMenu && showSubMenu && (
        <Collapse in={showSubMenu} timeout="auto" unmountOnExit>
          {nav.subMenus?.map((subNav) => (
            <MultiLevelMenuItem key={subNav.id} nav={subNav} sx={{ pl: 4 }} />
          ))}
        </Collapse>
      )}
    </>
  );
};

export default NavButton;
