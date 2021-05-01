import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  ClickAwayListener,
  Collapse,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import EnhancedTable from 'src/components/EnhancedTable';

const useStyles = makeStyles((theme) => ({
  root: {}
}));

const headCells = [
  { id: 'set_name', numeric: false, label: 'Set' },
  { id: 'card_number', numeric: true, label: '#' },
  { id: 'player_name', numeric: false, label: 'Player'},
  { id: 'team_name', numeric: false, label: 'Team' },
  { id: 'seq', numeric: false, narrow:true, label: 'Seq'},
  { id: 'other', numeric: false, label: 'Other'},
];

const Toolbar = ({ className, updateFilter, selections, onSelection, cards, ...rest }) => {
  const classes = useStyles();
  const [showResults, setShowResults] = useState(false);
  const [filter, setFilter] = useState('');

  const handleSearchFocus = (e) => {
    setShowResults(true);
  }
  const handleSearchBlur = (e) => {
    setShowResults(false);
  }
  const changeFilterStr = (e) => {
    setFilter(e.target.value);
  }
  return (
    
    <ClickAwayListener onClickAway={handleSearchBlur}>
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box>
        <TextField
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon
                  fontSize="small"
                  color="action"
                >
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
          placeholder="Search checklist"
          variant="outlined"
          onChange={changeFilterStr}
          onFocus={handleSearchFocus}
        />
        <Collapse in={showResults} style={{position:'relative'}}>
        <Box
          mt={0} style={{zIndex: 1000,position:'absolute'}}>
          <EnhancedTable 
            title="Checklist"
            toolbar={false} 
            compact={true} 
            header={headCells} 
            useCheckbox={false}
            onSelection={onSelection}
            selectedIds={selections}
            raised={true}
            data={cards.filter(e => e.player_name.toLowerCase().includes(filter.toLowerCase()))} /> 
        </Box>
      </Collapse>
      </Box>
    </div>
    </ClickAwayListener>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default React.memo(Toolbar);
