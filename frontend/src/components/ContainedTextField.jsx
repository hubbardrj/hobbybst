import React, { useState, useEffect, useCallback } from 'react';
import TextField from '@material-ui/core/TextField';

const ContainedTextField = ({
    setFieldValue, 
    ...props}) => {
    const [innerValue, setInnerValue] = useState('');
  
    useEffect(() => {
      if (props.value) {
        setInnerValue(props.value);
      } else {
        setInnerValue('');
      }
    }, [props.value]);
  
    const handleOnChange = useCallback((event) => {
      event.persist();
  
      const newValue = event.currentTarget.value;
      setInnerValue(newValue);
    }, []);

    const handleBlur = useCallback((event) => {
        event.persist();
    
        const newValue = event.currentTarget.value;
        setFieldValue(props.name, newValue);
      }, [setFieldValue, props.name]);
  
    return (
      <TextField
        {...props}
        value={innerValue}
        onChange={handleOnChange}
        onBlur={handleBlur}
      />
    );
  };
  export default ContainedTextField;