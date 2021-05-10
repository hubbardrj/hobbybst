import React from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  image: {
    display: 'inline-block',
    maxWidth: '100%',
  }
}));

const LandingView = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Hobby BST"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="md">
          <Card>
            <img
              alt="Under development"
              className={classes.image}
              src="/static/images/hobby-landing.jpg"
            />
          </Card>
        </Container>
      </Box>
    </Page>
  );
};

export default LandingView;
