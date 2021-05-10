import React, { useState, useRef, useCallback } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
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
  Typography,
  makeStyles,
  Checkbox
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Page from 'src/components/Page';
import { useSnackBars } from '../../contexts/Snackbar/SnackbarContext';
import { Alert, Autocomplete } from '@material-ui/lab';
import ImageUpload from 'src/components/ImageUpload';
import AsyncAutocomplete from 'src/components/AsyncAutocomplete';
import ContainedTextField from 'src/components/ContainedTextField';
import clsx from 'clsx';
import ChecklistTableInput from './ChecklistTableInput';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3),
  },
  card: {
    overflow: 'visible'
  },
  addButton: {
    marginLeft: theme.spacing(1)
  },
  hidden: {
    display:"none"
  }
}));
const createPayload = (form) => {
  let payload = {
    brand_id: form.brand.id,
    player_name: form.player.full_name ? form.player.full_name : form.player_name,
    player: {
      full_name: form.player.full_name ? form.player.full_name : form.player_name,
      sport_id: form.sport.id
    },
    card_number: form.cardNumber,
    set_name: form.setName,
    set_year: form.setYear,
    team: {
      name: form.team.name,
      sport_id: form.sport.id
    },
    seq: form.seq,
    notes: form.notes,
    front_of_card: form.frontImageUrl,
    back_of_card: form.backImageUrl
  };
  return payload;
}
const CardView = ({ 
  cardService,
  fileService,
  editMode = false 
  }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  const [years, setYears] = useState([]);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');
  const { addAlert } = useSnackBars();
  const cardNumberRef = useRef();
  const { id } = useParams();

  const [initialFormValues, setInitialFormValues] = useState({
    player: '',
    player_name: '',
    brand: '',
    cardNumber: '',
    setName: '',
    setYear:null,
    addAnother: false,
    addMultiple: false,
    team:'',
    sport:{abbr:""},
    seq:'',
    notes:'',
    cards:[],
    frontImageUrl:'',
    backImageUrl:'',
  });


  React.useEffect(() => {
    async function fetchData() {
      try {
        if (editMode) {
          const response = await cardService.get(id);
          const card = response.data;
          setInitialFormValues(prevState => (
            {
              ...prevState,
              brand: {id: card.brand.id,
              name: card.brand.name},
              setName: card.set_name,
              setYear: card.set_year,
              cardNumber: card.card_number,
              player_name: card.player_name,
              player: card.player ? card.player : card.player_name,
              team: card.team,
              sport:{
                id: card.brand.sport_id,
                abbr:card.team.sport},
              seq:card.seq,
              notes:card.notes,
              frontImageUrl:card.front_of_card,
              backImageUrl:card.back_of_card,
            })
          );
          setCardFront(card.front_of_card);
          setCardBack(card.back_of_card);
        }
      }
      catch (error) {
        addAlert(<Alert severity="error">An error occured while loading this page</Alert>);
        console.log(error);
      }
    }
    fetchData();
  }, [cardService, addAlert, editMode, id]);  

  React.useEffect(() => {
    var startYear = 1900;
    var yearSet = [];
    for (var i = new Date().getFullYear(); i > startYear; i--)
    {
      yearSet.push(i);
    }
    setYears(yearSet);
  }, [setYears]);

  const formSubmit = useCallback(
    async (form) => {
      try {
        if (form.addMultiple) {
          const newCards = form.cards.map(card => {
            return {
              brand_id: form.brand.id,
              player_name: card.player_name,
              player: {
                full_name: card.player_name,
                sport_id: form.sport.id
              },
              card_number: card.card_number,
              set_name: card.set_name,
              set_year: form.setYear,
              team: {
                name: card.team_name,
                sport_id: form.sport.id
              },
              seq: card.seq,
              other: card.other
            };
          });
          await cardService.createCard(newCards);
          addAlert(<Alert severity="success">Cards added successfully!</Alert>);
        }
        else {
          if (cardFront && cardFront !== form.frontImageUrl)
          {
            let file = await fileService.convertUrltoFile(cardFront, 'front');
            let fileUrl = await fileService.uploadToS3(file, 'jpg');
            form.frontImageUrl = fileUrl;
          }
          if (cardBack && cardBack !== form.backImageUrl)
          {
            let file = await fileService.convertUrltoFile(cardBack, 'back');
            let fileUrl = await fileService.uploadToS3(file, 'jpg');
            form.backImageUrl = fileUrl;
          }
          if (editMode)
          {
            await cardService.updateCard(id,createPayload(form));
            
            addAlert(<Alert severity="success">Card updated successfully!</Alert>);
          }
          else
          {
            await cardService.createCard(createPayload(form));
            addAlert(<Alert severity="success">Card added successfully!</Alert>);
          }
        }
        if (form.addAnother)
        {
          form.player = '';
          form.cardNumber = '';
          cardNumberRef.current.focus();
        }
        else
        {
          let destination = ['/app/cards/', id].filter(Boolean).join('');
          navigate(destination);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
  ,[addAlert, cardService, fileService, navigate, cardFront, cardBack, editMode, id]);

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
          <Card
            className={classes.card}
          >
            <CardHeader
              subheader={editMode ? "Edit Card" : "Add Card"}
            />
            <Divider />
            <Formik
              enableReinitialize={true}
              initialValues={initialFormValues}
              validationSchema={
                Yup.object().shape({
                  sport: Yup.object().required('Sport is required'),
                  brand: Yup.string().max(100).required('Brand is required'),
                  setYear: Yup.number().typeError('Year must be a number').min(1800, 'Too Low').required('Set Year is required'),
                  player: Yup.string().max(255)
                    .when("addMultiple", {
                      is: false,
                      then: Yup.string().required('Player name is required')
                    }),
                  team: Yup.object()
                    .when("addMultiple", {
                      is: false,
                      then: Yup.object().required('Team is required')
                  }),
                  cardNumber: Yup.string()
                    .when("addMultiple", {
                      is: false,
                      then: Yup.string().required('Card Number is required')
                    }),
                  setName: Yup.string().max(255)
                    .when("addMultiple", {
                      is: false,
                      then: Yup.string().required('Set Name is required')
                    }),
                  cards: Yup.array()
                    .when("addMultiple", {
                      is: true,
                      then: Yup.array().required('You must select some cards')
                    }),
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
                setFieldTouched,
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <CardContent style={{minHeight:'650px'}}>
                    <Grid container spacing={1} >
                      <Grid item xs={6} md={3}>
                      <AsyncAutocomplete
                          name="sport"
                          fetch={cardService.getSports}
                          value={values.sport}
                          label="Sport"
                          setFieldValue={setFieldValue}
                          selectLabel="abbr"
                          onBlur={handleBlur}
                          error={Boolean(touched.sport && errors.sport)}
                          helperText={touched.sport && errors.sport}
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
                        value={values.setYear}
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
                          variant="outlined"
                          fullWidth
                        />}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <AsyncAutocomplete
                          name="brand"
                          fetch={cardService.findBrands}
                          fetchParams={values.sport?.abbr}
                          value={values.brand}
                          label="Brand"
                          setFieldValue={setFieldValue}
                          selectLabel="name"
                          onBlur={handleBlur}
                          error={Boolean(touched.brand && errors.brand)}
                          helperText={touched.brand && errors.brand}
                        />
                      </Grid>
                  </Grid>
                  {editMode ? null :
                  
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
                  />}
                    {Boolean(touched.cards && errors.cards) ? 
                      <Typography color="error">{errors.cards}</Typography> : null}
                    {editMode ? null :
                    <Grid container className={clsx({[classes.hidden]: !values.addMultiple})}>
                      <Grid item xs={12}>
                        <ChecklistTableInput
                          name="cards"
                          fetch={cardService.getChecklist}
                          brand={values.brand}
                          year={values.setYear}
                          onChange={setFieldValue}
                          onTouch={setFieldTouched}
                        />
                      </Grid>
                    </Grid>}
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
                        <ContainedTextField
                          error={Boolean(touched.cardNumber && errors.cardNumber)}
                          fullWidth
                          helperText={touched.cardNumber && errors.cardNumber}
                          label="Card Number"
                          margin="normal"
                          name="cardNumber"
                          setFieldValue={setFieldValue}
                          value={values.cardNumber}
                          variant="outlined"
                          type="text"
                          inputRef={cardNumberRef}
                        />
                      </Grid>
                      <Grid item xs={8} sm={6}>
                        <AsyncAutocomplete
                          name="player"
                          fetch={cardService.findPlayers}
                          fetchParams={values.sport?.abbr}
                          value={values.player}
                          label="Player"
                          setFieldValue={setFieldValue}
                          selectLabel="full_name"
                          error={Boolean(touched.player && errors.player)}
                          helperText={touched.player && errors.player}
                        />
                      </Grid>
                    </Grid>
                    <Grid 
                      container 
                      spacing={1}
                      className={clsx({[classes.hidden]: values.addMultiple})}
                    >
                      <Grid item xs={4} sm={4}>
                      <AsyncAutocomplete
                          name="team"
                          fetch={cardService.findTeams}
                          fetchParams={values.sport?.abbr}
                          value={values.team}
                          label="Team"
                          setFieldValue={setFieldValue}
                          selectLabel="name"
                          error={Boolean(touched.team && errors.team)}
                          helperText={touched.team && errors.team}
                        />
                        
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <ContainedTextField
                          error={Boolean(touched.seq && errors.seq)}
                          fullWidth
                          helperText={touched.seq && errors.seq}
                          label="Seq"
                          margin="normal"
                          name="seq"
                          setFieldValue={setFieldValue}
                          value={values.seq}
                          variant="outlined"
                          type="string"
                        />
                      </Grid>
                      <Grid item xs={8} sm={6}>
                        <ContainedTextField
                          error={Boolean(touched.notes && errors.notes)}
                          fullWidth
                          helperText={touched.notes && errors.notes}
                          label="Notes"
                          margin="normal"
                          name="notes"
                          setFieldValue={setFieldValue}
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
                            value={cardFront}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ImageUpload 
                          label="Back of Card"
                          setImageUrl={setCardBack}
                          value={cardBack}
                        />
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
                      className={classes.addButton}
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={(e)=>{
                        setFieldValue('addAnother', false)
                        handleSubmit(e, cardFront, cardBack);
                      }}
                    >
                      {editMode ? 'Update Card' : 'Add to Collection'}
                    </Button>
                  </Box>
                </CardContent>
              </form>
              )}
            </Formik>
          </Card>
        </Box>
      </Container>
    </Page>
  );
};

export default CardView;
