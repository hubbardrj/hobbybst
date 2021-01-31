import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import EnhancedTable from 'src/components/EnhancedTable';
import Toolbar from './Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CardListView = ({cardService}) => {
  const classes = useStyles();
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('');

  const changeFilterStr = (e) => {
    setFilter(e.target.value);
  }

  React.useEffect(() => {
    async function fetchData() {
      try {
        const cards = await cardService.getAll();
        setCards(cards.data);
      }
      catch (error) {
        console.log('error man');
      }
    }
    fetchData();
  }, [cardService]);  

  const headCells = [
    { id: 'player_name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'card_number', numeric: false, disablePadding: false, label: 'Card #' },
    { id: 'set_name', numeric: false, disablePadding: false, label: 'Set Name' },
    { id: 'set_year', numeric: true, disablePadding: false, label: 'Set Year' }
  ];
  return (
    <Page
      className={classes.root}
      title="My Cards"
    >
      <Container maxWidth={false}>
        <Toolbar updateFilter={changeFilterStr} />
        <Box mt={3}>
          <EnhancedTable header={headCells} rows={cards.filter(e => e.player_name.toLowerCase().includes(filter))} />
        </Box>
      </Container>
    </Page>
  );
};

export default CardListView;
