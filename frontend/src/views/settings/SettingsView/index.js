import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Notifications from './Notifications';
import Password from './Password';
import useAccountService from '../AccountService';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SettingsView = () => {
  const classes = useStyles();
  const [accountService] = useState(useAccountService());
  return (
    <Page
      className={classes.root}
      title="Settings"
    >
      <Container maxWidth="lg">
        <Notifications />
        <Box mt={3}>
          <Password accountService={accountService}/>
        </Box>
      </Container>
    </Page>
  );
};

export default SettingsView;
