import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Container,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Alert } from '@material-ui/lab';
import Page from 'src/components/Page';
import { useSnackBars } from '../../contexts/SnackbarContext';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  addButton: {
    marginLeft: theme.spacing(1)
  }
}));

const CardView = ({ cardService }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { addAlert } = useSnackBars();

  const handleClick = () => {
    addAlert(<Alert variant="filled" severity="success">This is a success message!</Alert>);
  };
  return (
    <Page
      className={classes.root}
      title="Card"
    >      
      <Container maxWidth="lg">
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
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="top"
          mt={3}
        >
          <Formik
            initialValues={{
              playerName: '',
              cardNumber: '',
              setName: ''
            }}
            validationSchema={
              Yup.object().shape({
                playerName: Yup.string().max(255).required('Player name is required'),
                cardNumber: Yup.number().required('Card Number is required'),
                setName: Yup.string().max(255).required('Set Name is required')
              })
            }
            onSubmit={async (form) => {
              try {
                await cardService.createCard(
                  {
                    card_company: form.company,
                    player_name: form.playerName,
                    card_number: form.cardNumber,
                    set_name: form.setName,
                    set_year: form.setYear
                  });
                  addAlert(<Alert severity="success">Card added successfully!</Alert>);
                navigate('/app/cards');
              }
              catch (error) {
                console.log(error);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader
                    subheader="Add Card"
                  />
                  <Divider />
                  <CardContent >
                    <Grid container spacing={1} >
                      <Grid item xs={6} sm={3}>
                        <TextField 
                        error={Boolean(touched.company && errors.company)}
                        helperText={touched.company && errors.company}
                        label="Company"
                        margin="normal"
                        name="company"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.company}
                        variant="outlined"
                        fullWidth
                      />
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <TextField
                        error={Boolean(touched.setYear && errors.setYear)}
                        helperText={touched.setYear && errors.setYear}
                        label="Set Year"
                        margin="normal"
                        name="setYear"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="number"
                        value={values.setYear}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <TextField
                      error={Boolean(touched.setName && errors.setName)}
                      helperText={touched.setName && errors.setName}
                      label="Set Name"
                      margin="normal"
                      name="setName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.setName}
                      variant="outlined"
                      fullWidth
                    />
                    </Grid>
                    </Grid>
                  
                    <TextField
                      error={Boolean(touched.playerName && errors.playerName)}
                      fullWidth
                      helperText={touched.playerName && errors.playerName}
                      label="Player Name"
                      margin="normal"
                      name="playerName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="text"
                      value={values.playerName}
                      variant="outlined"
                    />
                    <TextField
                      error={Boolean(touched.cardNumber && errors.cardNumber)}
                      fullWidth
                      helperText={touched.cardNumber && errors.cardNumber}
                      label="Card Number"
                      margin="normal"
                      name="cardNumber"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.cardNumber}
                      variant="outlined"
                      type="number"
                    />
                    <Box mt={3}
                      display="flex"
                      justifyContent="flex-end"
                    >
                      <Button
                        color="primary"
                        disabled={isSubmitting}

                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Save and Add Another
                      </Button>
                      <Button
                        color="primary"
                        disabled={isSubmitting}
                        className={classes.addButton}
                        size="large"
                        type="submit"
                        variant="contained"
                      >
                        Add to Collection
                      </Button>
                      
                      <Button onClick={handleClick}>Open simple snackbar</Button>
                    </Box>
                  </CardContent>
                </Card>
              </form>
            )}
          </Formik>
        </Box>
      </Container>
    </Page>
  );
};

export default CardView;
