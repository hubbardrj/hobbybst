import React, { useState, useRef, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardHeader,  
  CardContent,
  Container,
  FormControlLabel,
  Divider,
  Grid,
  TextField,
  makeStyles,
  Checkbox
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Page from 'src/components/Page';
import { useSnackBars } from '../../contexts/Snackbar/SnackbarContext';
import { Alert, Autocomplete } from '@material-ui/lab';
import ImageUpload from 'src/components/ImageUpload';
import clsx from 'clsx';
import ChecklistLoad from './ChecklistTableInput';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  hidden: {
    display:"none"
  }
}));
const headCells = [
  { id: 'set', numeric: false, label: 'Set' },
  { id: 'card_number', numeric: true, narrow:true, label: 'Card #' },
  { id: 'player_name', numeric: false, label: 'Player'},
  { id: 'team', numeric: false, label: 'Team' },
  { id: 'seq', numeric: false, narrow:true, label: 'Seq', input: true },
  { id: 'other', numeric: false, label: 'Other', input: true },
];
const createCards = () => {
  var c = [];
  for(var i=0; i<8000; i++) {
    c.push({ id:i, set: 'Base', card_number:i, player_name: 'Test '+i, team: 'Chicago Bulls', seq:'/50', other:'' });
  }
  return c;
  };

const CardView = ({ cardService }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  const [sports, setSports] = useState([]);
  const [years, setYears] = useState([]);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const { addAlert } = useSnackBars();
  const cardNumberRef = useRef();
  const cards = createCards();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const sports = await cardService.getSports();
        setSports(sports.data);
      }
      catch (error) {
        console.log('error man');
      }
    }
    fetchData();
  }, [cardService]);  
  React.useEffect(() => {
    console.log(cardFront);
  }, [cardFront]); 
  React.useEffect(() => {
    var startYear = 1900;
    var yearSet = [];
    for (var i = new Date().getFullYear(); i > startYear; i--)
    {
      yearSet.push(i);
    }
    setYears(yearSet);
  }, [setYears])
  
  const formSubmit = useCallback(
    async (form) => {
      try {
        console.log('submit');
        await cardService.createCard(
          {
            brand: form.brand,
            player: {full_name: form.playerName},
            card_number: form.cardNumber,
            set_name: form.setName,
            set_year: form.setYear,
            team: {
              name: form.team,
              sport_id: form.sport.id
            },
            front_of_card: cardFront,
            back_of_card: cardBack
          });
          addAlert(<Alert severity="success">Card added successfully!</Alert>);
        if (form.addAnother)
        {
          form.playerName = '';
          form.cardNumber = '';
          cardNumberRef.current.focus();
        }
        else
        {
          navigate('/app/cards');
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  ,[addAlert, cardService, navigate, cardFront, cardBack])
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
              brand: '',
              cardNumber: '',
              setName: '',
              setYear:2021,
              addAnother: false,
              addMultiple: false,
              team:'',
              seq:'',
              notes:''
            }}
            validationSchema={
              Yup.object().shape({
                sport: Yup.string().required('Sport is required'),
                brand: Yup.string().max(100).required('Brand is required'),
                setYear: Yup.number().typeError('Year must be a number').min(1800, 'Too Low').required('Set Year is required'),
                playerName: Yup.string().max(255).required('Player name is required'),
                cardNumber: Yup.string().required('Card Number is required'),
                setName: Yup.string().max(255).required('Set Name is required'),
                seq: Yup.string().max(10).typeError('Seq must be a number'),
              })
            }
            onSubmit={formSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              setFieldValue,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader
                    subheader="Add Card"
                  />
                  <Divider />
                  <CardContent style={{minHeight:'650px'}}>
                    <Grid container spacing={1} >
                      <Grid item xs={6} md={3}>
                      <Autocomplete 
                        options={sports}
                        autoHighlight
                        autoSelect
                        selectOnFocus
                        getOptionLabel={option => option.abbr}
                        onChange={(e, value) => {
                          setFieldValue("sport", value);
                        }}
                        renderInput={(params) => 
                        <TextField
                          {...params}
                          error={Boolean(touched.sport && errors.sport)}
                          helperText={touched.sport && errors.sport}
                          label="Sport"
                          margin="normal"
                          name="sport"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.sport}
                          variant="outlined"
                          fullWidth
                          autoFocus
                        />}
                      />
                      </Grid>
                      <Grid item xs={6} md={3}>
                      <Autocomplete 
                        options={years}
                        getOptionLabel={(option) => option.toString()}
                        autoHighlight
                        autoSelect
                        selectOnFocus
                        onChange={(e, value) => {
                          setFieldValue("setYear", value);
                        }}
                        renderInput={(params) => 
                        <TextField
                          {...params}
                          error={Boolean(touched.setYear && errors.setYear)}
                          helperText={touched.setYear && errors.setYear}
                          label="Set Year"
                          margin="normal"
                          name="setYear"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.setYear}
                          variant="outlined"
                          fullWidth
                        />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                        error={Boolean(touched.brand && errors.brand)}
                        helperText={touched.brand && errors.brand}
                        label="Brand"
                        margin="normal"
                        name="brand"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.brand}
                        variant="outlined"
                        fullWidth
                      />
                      </Grid>
                  </Grid>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.addMultiple}
                          onChange={handleChange}
                          name="addMultiple"
                          color="primary"
                        />
                      }
                      label="Select Cards from Checklist"
                      />
                    <Grid 
                      container 
                      spacing={1}
                      className={clsx({[classes.hidden]: values.addMultiple})}
                    >
                      <Grid item xs={4} sm={4}>
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
                      <Grid item xs={4} sm={2}>
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
                          type="text"
                          inputRef={cardNumberRef}
                        />
                      </Grid>
                      <Grid item xs={8} sm={6}>
                        <TextField
                          error={Boolean(touched.playerName && errors.playerName)}
                          fullWidth
                          helperText={touched.playerName && errors.playerName}
                          label="Player"
                          margin="normal"
                          name="playerName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          variant="outlined"
                          value={values.playerName}
                        />
                      </Grid>
                    </Grid>
                    <Grid 
                      container 
                      spacing={1}
                      className={clsx({[classes.hidden]: values.addMultiple})}
                    >
                      <Grid item xs={4} sm={4}>
                        <TextField
                        error={Boolean(touched.team && errors.team)}
                        helperText={touched.team && errors.team}
                        label="Team"
                        margin="normal"
                        name="team"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.team}
                        variant="outlined"
                        fullWidth
                      />
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <TextField
                          error={Boolean(touched.seq && errors.seq)}
                          fullWidth
                          helperText={touched.seq && errors.seq}
                          label="Seq"
                          margin="normal"
                          name="seq"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.seq}
                          variant="outlined"
                          type="string"
                        />
                      </Grid>
                      <Grid item xs={8} sm={6}>
                        <TextField
                          error={Boolean(touched.notes && errors.notes)}
                          fullWidth
                          helperText={touched.notes && errors.notes}
                          label="Notes"
                          margin="normal"
                          name="notes"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          type="text"
                          variant="outlined"
                          value={values.notes}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={1} className={clsx({[classes.hidden]: values.addMultiple})}>
                      <Grid item xs={12} sm={6}>
                        <ImageUpload 
                            label="Front of Card"
                            setImageUrl={setCardFront}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ImageUpload 
                          label="Back of Card"
                          setImageUrl={setCardBack}
                        />
                      </Grid>
                    </Grid>
                    <Grid container className={clsx({[classes.hidden]: !values.addMultiple})}>
                      <Grid item xs={12}>
                        <ChecklistLoad data={cards}/>
                      </Grid>
                    </Grid>
                  <Divider />
                  <Box
                    display="flex"
                    justifyContent="flex-end"
                    p={2}
                  >
                    <Button
                      color="primary"
                      disabled={isSubmitting}
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={(e)=>{
                        setFieldValue('addAnother', true);
                        handleSubmit(e, cardFront, cardBack);
                      }}
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
                      onClick={(e)=>{
                        setFieldValue('addAnother', false)
                        handleSubmit(e, cardFront, cardBack);
                      }}
                    >
                      Add to Collection
                    </Button>
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
