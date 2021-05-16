import React, {useCallback} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

function AsyncAutocomplete({
    name,
    fetch, 
    fetchParams,
    error,
    helperText,
    setFieldValue,
    selectLabel,
    value,
    ...props}) {
      
  const filter = createFilterOptions();
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [queryParams, setQueryParams] = React.useState(fetchParams);
  const loading = open && options.length === 0;
  
  React.useEffect(() => {
    let active = true;
    if (!loading && queryParams === fetchParams) {
      return undefined;
    }
    (async () => {
      const response = await fetch(fetchParams);
      if (active) {
        setOptions(response.data);
        setQueryParams(fetchParams);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading, fetch, fetchParams, queryParams]);

  const handleOnChange = useCallback((event, value, reason) => {
    event.persist();

    if (typeof value === 'string') {
      setFieldValue(name, {
        [selectLabel]: value,
      });
    } else if (value && value.inputValue) {
      setFieldValue(name, {
        [selectLabel]: value.inputValue,
      });
    } else {
      setFieldValue(name, value);
    }
  }, [selectLabel, name, setFieldValue]);


  return (
    <Autocomplete
      id={name}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleOnChange}
      options={options}
      getOptionSelected={(option, value) => option[selectLabel] === value[selectLabel]}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
            return option;
        }
        if (option.inputValue) {
            return option.inputValue;
        }
        return option[selectLabel];}}
      loading={loading}
      selectOnFocus
      freeSolo
      autoSelect
      blurOnSelect={true}
      value={value}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            name: params.inputValue,
          });
        }
        return filtered;
      }}
      ListboxProps={
        {
          style:{
              maxHeight: '200px',
          }
        }
      }
      renderInput=
      {(params) => (
        <TextField
          {...params}
          {...props}
          margin="normal"
          variant="outlined"
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
export default React.memo(AsyncAutocomplete);