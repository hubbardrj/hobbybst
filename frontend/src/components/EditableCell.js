import React from 'react';
import { Input } from "@material-ui/core";
import PropTypes from 'prop-types';

const EditableCell = ({
    value: initialValue,
    row,
    column: id,
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)
  
    const onChange = e => {
      setValue(e.target.value)
    }
  
    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(row, id, value)
    }
  
    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    return (
        <Input 
            margin="dense"
            size="small"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            fullWidth
        />
    )
}

EditableCell.propTypes = {
    cell: PropTypes.shape({
      value: PropTypes.any.isRequired,
    }),
    row: PropTypes.object.isRequired,
    column: PropTypes.string.isRequired,
    updateMyData: PropTypes.func.isRequired,
}
export default EditableCell;
