import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';
import useAccountService from '../AccountService';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Account = () => {
  const classes = useStyles();
  const [accountService] = useState(useAccountService());

  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <Profile />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <Box>
              <ProfileDetails accountService={accountService} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
