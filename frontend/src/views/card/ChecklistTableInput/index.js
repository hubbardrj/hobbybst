import React, { useCallback, useState } from 'react';
import {
  Box
} from '@material-ui/core';
import EnhancedTable from 'src/components/EnhancedTable';
import Toolbar from './Toolbar';

const headCells = [
  { id: 'set_name', numeric: false, label: 'Set' },
  { id: 'card_number', numeric: true, label: '#' },
  { id: 'player_name', numeric: false, label: 'Player'},
  { id: 'team_name', numeric: false, label: 'Team' },
  { id: 'seq', numeric: false, narrow:true, label: 'Seq', input:true},
  { id: 'other', numeric: false, label: 'Other', input:true},
];

const ChecklistTableInput = ({name, fetch, brand, year, onChange, onTouch}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [cards, setCards] = useState([]);

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

  React.useEffect(() => {
    async function fetchData() {
      try {
        if (brand.id && year) {
          console.log('fetch');
          const checklist = await fetch(brand.id, year);
          setCards(checklist.data[0].cards);
        } 
        else {
          setCards([]);
        }
      }
      catch {

      }
    }
    fetchData();
       
  }, [fetch, brand, year]);

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

  React.useEffect(() => {
    onChange(name, selectedRows);
    if (selectedRows.length > 0)
    {
      onTouch(name, true);
    }
  },[selectedRows, onChange, name, onTouch]);

  return (
      <React.Fragment>
        <Toolbar onSelection={handleCheckedRow} cards={cards} selections={selectedIds} />
        <Box mt={1} >
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

export default ChecklistTableInput;
