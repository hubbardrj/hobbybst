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
import * as actions from '../../../contexts/Auth/AuthActions';
import { useAuthDispatch } from '../../../contexts/Auth'

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
  const [profile, setProfile] = useState();
  const dispatch = useAuthDispatch();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const profile = await accountService.getProfile();
        setProfile(profile.data);
      }
      catch (error) {
        console.log('An error occured loading your profile, please refresh');
      }
    }
    fetchData();
  }, [accountService]);  

  const  updateProfile = async (data) => {
    try {
      console.log(data)
      const response = await accountService.updateProfile(
        {
          username: profile.username,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName
        }
      )
      setProfile(response.data);
      actions.updateProfile(dispatch, response.data);
    }
    catch (error) {

    }
  };


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
            {profile ? <Profile profile={profile} /> : null}
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <Box>
              {profile ? <ProfileDetails profile={profile} updateMethod={updateProfile} /> : null}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Account;
