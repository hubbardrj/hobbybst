import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles
} from '@material-ui/core';
import { useSnackBars } from '../../../contexts/Snackbar/SnackbarContext';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(({
  root: {}
}));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const Password = ({ className, accountService, ...rest }) => {
  const classes = useStyles();
  const { addAlert } = useSnackBars();

  return (
    <Formik
      initialValues={{
        password: '',
        confirm: ''
      }}
      validationSchema={
        Yup.object().shape({
          password: Yup.string().required('New password is required'),
          confirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Password is required'),
        })
      }
      onSubmit={ async (form, { setSubmitting, setFieldError }) => {
        try {
          await sleep(500);
          await accountService.updatePassword(
            {
              new_password1: form.password,
              new_password2: form.confirm
            });
            addAlert(<Alert severity="success">Password updated successfully!</Alert>);
        }
        catch (error) {
          console.log(error.response);
          setFieldError("password", error.response.data.new_password2[0]);
        }
        finally {
          setSubmitting(false);
        }
    }}
    >
    {({
      errors,
      handleBlur,
      handleChange,
      handleSubmit,
      isSubmitting,
      isValid,
      touched,
      values
    }) => (
    <form
      onSubmit={handleSubmit}
      className={clsx(classes.root, className)}
    >
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            fullWidth
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
            label="Password"
            margin="normal"
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            error={Boolean(touched.confirm && errors.confirm)}
            helperText={touched.confirm && errors.confirm}
            label="Confirm password"
            margin="normal"
            name="confirm"
            onBlur={handleBlur}
            onChange={handleChange}
            type="password"
            value={values.confirm}
            disabled={isSubmitting}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={Boolean(!isValid || isSubmitting)}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
    )}
    </Formik>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
