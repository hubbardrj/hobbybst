import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  makeStyles,
  Paper
} from '@material-ui/core';
import Page from 'src/components/Page';

import {
  useParams, Link as RouterLink,
} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CardDetails from './CardDetails';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  statBox: {
    marginTop:'auto',
    borderTop:'2px #00838f solid'
  },
  statBoxItem: {
    borderLeft: '2px #00838f solid'
  },
  statBoxItemEnd: {
    borderRight: '2px #00838f solid'
  }
}));

const CardDetailView = ({cardService}) => {
  const { id } = useParams();
  const classes = useStyles();
  const [card, setCard] = useState({});

  React.useEffect(() => {
    async function fetchData() {
      try {
        const card = await cardService.get(id);
        setCard(card.data);
      }
      catch (error) {
        console.log('Error Loading Card');
      }
    }
    fetchData();
  }, [cardService, id]);  

  return (
    <Page
      className={classes.root}
      title="My Cards"
    >
      <Container maxWidth={false}>
        <Box
          display="flex"
        >
          <Button
            color="default"
            component={RouterLink}
            to="/app/cards"
          >
            <ArrowBackIcon />Collection
          </Button>
        </Box>
        <Box mt={3}>
          <Paper elevation={3}>
            <CardDetails card={card} />
          </Paper>
        </Box>
      </Container>
    </Page>
  );
};

export default CardDetailView;
