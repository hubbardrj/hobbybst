import React from 'react';
import {Box, Typography} from '@material-ui/core';

const DisplayField = ({label, value, ...props}) => {
  
    return (
      <Box pt={1} pb={1}>
        <Typography
          align="center"
          color="primary"
          variant="body1"
        >
          {label}
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          {value}
        </Typography>
      </Box>
    );
  };
  export default DisplayField;