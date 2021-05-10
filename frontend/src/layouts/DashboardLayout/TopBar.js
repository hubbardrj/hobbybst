import React, { useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Logo from 'src/components/Logo';
import { useAuthDispatch, logout } from '../../contexts/Auth';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  },
  button: {
    color: '#fff',
    marginRight: '1em',
    borderRadius: 0
  },
  active: {
    borderBottom: '2px solid #fb9224'
  }
}));

const TopBar = ({
  className,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  const [notifications] = useState([]);
  const dispatch = useAuthDispatch();
  
  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <Hidden smDown>
        <Button
            activeClassName={classes.active}
            className={classes.button}
            component={RouterLink}
            to='/app/dashboard'
          >
            <span className={classes.title}>
              Dashboard
            </span>
          </Button>
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={RouterLink}
            to='/app/cards'
          >
            <span className={classes.title}>
              Collection
            </span>
          </Button>
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={()=>logout(dispatch)}>
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden mdUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
