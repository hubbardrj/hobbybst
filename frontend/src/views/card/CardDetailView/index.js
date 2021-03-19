import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import {
  useParams, Link as RouterLink,
} from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CardDetailView = ({cardService}) => {
  const { id } = useParams();
  const classes = useStyles();
  const [card, setCard] = useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const card = await cardService.get(id);
        setCard(card.data);
      }
      catch (error) {
        console.log('error man');
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
        <Box mt={3} >
          <Paper elevation={3} >
            <Grid 
              container 
              spacing={0} 
              >
              <Grid item xs={6} sm={3}>
                <img src='/static/images/avatars/avatar_1.png' alt='Card Front' height='100%' width='100%'/>
              </Grid>
              <Grid item xs={6} sm={6}>
                <Box p={3}>
                <Typography variant="h4">{card.card_company} | {card.set_year} | {card.set_name} </Typography>
                <Typography variant="h1">#{card.card_number} {card.player_name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box 
                display="flex"
                justifyContent="flex-end"
                p={5}>
                  <Button
                    color="secondary"
                    variant="contained"
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Page>
  );
};

export default CardDetailView;
