import React, { useCallback, useState } from 'react';
import {
  Box,
  makeStyles
} from '@material-ui/core';
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

const headCells = [
  { id: 'set', numeric: false, label: 'Set' },
  { id: 'card_number', numeric: true, label: '#' },
  { id: 'player_name', numeric: false, label: 'Player'},
  { id: 'team', numeric: false, label: 'Team' },
  { id: 'seq', numeric: false, narrow:true, label: 'Seq', input:true},
  { id: 'other', numeric: false, label: 'Other', input:true},
];
const createCards = () => {
  var c = [];
  for(var i=0; i<800; i++) {
    c.push({ id:i, set: 'All Time League Leaders Holo Purple Laser', card_number:i, player_name: 'Test '+i, team: 'Chicago Bulls', seq:"/50", other:"" });
  }
  return c;
};

const ChecklistLoad = ({data}) => {
  const classes = useStyles();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const updateSelectedRow = useCallback((row, added) => {
    setSelectedRows(prevState => {
      if (row === null) {
        return [];
      }
      if (added){
        return [...prevState, row]
      }
      else {
        return prevState.filter((e)=>(e.id !== row.id))
      }
    });
  },[]);

  const handleCheckedRow = useCallback((ids, row, added) => {
    setSelectedIds(ids);
    updateSelectedRow(row, added);
  }, [updateSelectedRow]);
  const handleFieldUpdate = useCallback((row, field, value) => {
    const objIndex = selectedRows.findIndex((obj => obj.id === row.id));
    const newRows = [...selectedRows];
    let item = {...newRows[objIndex]};
    item[field] = value;
    newRows[objIndex] = item;
    setSelectedRows(newRows);
  },[selectedRows]);

  return (
      <React.Fragment>
        <Toolbar onSelection={handleCheckedRow} cards={data} selections={selectedIds} />
        <Box mt={1}>
          <EnhancedTable 
            title="Cards to Add"
            toolbar={true} 
            compact={false} 
            header={headCells} 
            useCheckbox={false}
            handleFieldUpdate={handleFieldUpdate}
            data={selectedRows} 
            onSelection={handleCheckedRow}
            selectedIds={selectedIds} /> 
        </Box>
      </React.Fragment>
  );
};

export default ChecklistLoad;
