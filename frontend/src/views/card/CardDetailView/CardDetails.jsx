import React from 'react';
import {
  useLocation, Link as RouterLink,
} from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import DisplayField from 'src/components/DisplayField';
import PropTypes from 'prop-types';
import AccountBoxSharpIcon from '@material-ui/icons/AccountBoxSharp';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  statBox: {
    marginTop: 'auto',
    borderTop: '2px #00838f solid'
  },
  statBoxItem: {
    borderLeft: '2px #00838f solid'
  },
  statBoxItemEnd: {
    borderRightWidth: '2px',
    borderRightStyle: 'solid',
    borderColor: theme.palette.primary.main
  }
}));

const CardDetails = ({
  card,
  setEditable,
  ...props
}) => {
  // We need to keep and update the state of the cell normally
  const classes = useStyles();
  const location = useLocation();

  return (
    <Grid
      container
      spacing={0}
    >
      <Grid item xs={6} sm={3}>
        <Avatar variant='square' style={{ width: '100%', height: '100%' }}>
          <AccountBoxSharpIcon style={{ fontSize: '14.188rem' }} />
          {/* <img src='/static/images/avatars/avatar_1.png' alt='Card Front' height='100%' width='100%'/> */}
        </Avatar>
      </Grid>
      <Grid item xs={12} sm={9} container spacing={0} justify="space-between" direction="row">
        <Grid item xs={9}>
          <Box p={3}>
            <Typography variant="h4">{card.brand?.name} | {card.set_year} | {card.set_name} </Typography>
            <Typography variant="h1">{card.player_name}</Typography>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box
            display="flex"
            justifyContent="flex-end"
            p={5}>
            <Button
              color="secondary"
              variant="contained"
              component={RouterLink}
              to={location.pathname+"/edit"}
            >
              Edit
                </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} container spacing={0} direction="row" justify="center" className={classes.statBox}>
          <Grid item xs={2} className={classes.statBoxItem}>
            <DisplayField
              label='#'
              value={card.card_number}
            />
          </Grid>
          <Grid item xs={2} className={classes.statBoxItem}>
            <DisplayField
              label='Seq'
              value={card.seq}
            />
          </Grid>
          <Grid item xs={2} className={classes.statBoxItem}>
            <DisplayField
              label='Team'
              value={card.team_name}
            />
          </Grid>
          <Grid item xs={2} className={`${classes.statBoxItem} ${classes.statBoxItemEnd}`}>
            <DisplayField
              label='Notes'
              value={card.notes}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

CardDetails.propTypes = {
  card: PropTypes.object.isRequired,
}
export default CardDetails;
