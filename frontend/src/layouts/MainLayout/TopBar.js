import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Toolbar,
  makeStyles, Button
} from '@material-ui/core';
import Logo from 'src/components/Logo';
import { useAuthState, useAuthDispatch, logout } from '../../contexts/Auth'

const useStyles = makeStyles(({
  root: {},
  toolbar: {
    height: 64
  }
}));

const TopBar = ({ className, isAuthenticated, ...rest }) => {
  const classes = useStyles();
  const dispatch = useAuthDispatch();
  const userDetails = useAuthState();
  
  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar className={classes.toolbar}>
        <RouterLink to="/app/dashboard">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        {userDetails.isLoggedin ? <Button onClick={()=>logout(dispatch)}>Logout</Button> : <RouterLink to="/login">Login</RouterLink>}
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string
};

export default TopBar;
