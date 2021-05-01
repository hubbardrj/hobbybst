import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { lighten } from '@material-ui/core/styles';
import {
    Card,
    Checkbox,
    IconButton,
    Table,
    TableContainer,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography,
    makeStyles
  } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import EditableCell from './EditableCell';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, filters, headCells, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, onRequestFilter, useCheckbox } = props;
  const [showFilters, setShowFilters] = useState(false);

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const createFilterHandler = (property) => (event) => {
    onRequestFilter(event, property);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {useCheckbox ?
            <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all' }}
          />
          : null
          }
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            className={headCell.narrow ? classes.narrowCell : null}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden} />
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        {filters ? 
          <TableCell
          className={classes.filterIcon}
        >
          <Tooltip title="Filter list">
            <IconButton 
              aria-label="filter list"
              onClick={toggleFilters}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        : null}
      </TableRow>
      {showFilters ?
        <TableRow>
          <TableCell padding="checkbox"/>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              className={classes.filters}
            >
              {headCell.input ? null :
              <TextField
                id="filled-secondary"
                label=""
                variant="outlined"
                size="small"
                onChange={createFilterHandler(headCell.id)}
              />
              }
            </TableCell>
          ))}
      </TableRow>
      : null
      }
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  headCells: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  filters: PropTypes.bool
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, title, compact, onClear} = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
      variant={compact ? 'dense' : 'regular'}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {title}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Clear Selections">
          <IconButton aria-label="cancel" onClick={onClear}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {},
    avatar: {
      marginRight: theme.spacing(2)
    },
    narrowCell: {
      'width': '10%',
    },
    filterIcon: {
      'width': '50px',
    },
    filters: {
      padding: '6px',
    }
  }));

const EnhancedTable = (
  { className, 
    header, 
    data, 
    compact, 
    filters, 
    toolbar, 
    useCheckbox = true, 
    raised = false,
    selectedIds = [], 
    title, 
    onSelection = () => {}, 
    handleFieldUpdate, 
    ...rest}) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Name');
  const [filterBy, setFilterBy] = React.useState({});
  const [selected, setSelected] = React.useState(selectedIds);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [useToolbar] = React.useState(toolbar);
  const [rows, setRows] = React.useState(data);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleRequestFilter = (event, property) => {
    const value = event.target.value.toLowerCase();
    setFilterBy(prevState => ({
      ...prevState,
      [property]: value
    }));    
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      onSelection(newSelecteds);
      return;
    }
    setSelected([]);
    onSelection([], null, false);
  };

  const handleClick = (event, row) => {
    const name = row.id;
    const selectedIndex = selected.indexOf(name);
    let rowAdded = false;
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      rowAdded = true;
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    onSelection(newSelected, row, rowAdded);
    event.stopPropagation();
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => {
    return selected.indexOf(name) !== -1;
  }

  React.useEffect(() => {
    setRows(data.filter(item => 
      {
        for(var key in filterBy) {
          if (!item[key].toString().toLowerCase().includes(filterBy[key]))
            return false;
        }
        return true;
      }));
  }, [setRows, filterBy, data]); 

  React.useEffect(() => {
    setSelected(selectedIds);
  },[selectedIds]);

  return (
    <Card
      raised={raised}
      className={clsx(classes.root, className)}
      {...rest}
    >{console.log('tabling '+title)}
        <PerfectScrollbar>
            {useToolbar ? <EnhancedTableToolbar numSelected={selected.length} title={title} compact={compact} onClear={handleSelectAllClick} /> : null }
            <TableContainer>
                <Table
                  size={compact ? 'small' : 'medium'}
                >
                <EnhancedTableHead
                    classes={classes}
                    headCells={header}
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    onRequestFilter={handleRequestFilter}
                    rowCount={rows.length}
                    filters={filters}
                />
                <TableBody>
                    {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox" onClick={(event) => handleClick(event, row)}>
                              {useCheckbox ? 
                                <Checkbox
                                  checked={isItemSelected}
                                  inputProps={{ 'aria-labelledby': labelId }}
                                /> :
                                <IconButton
                                >
                                  {isItemSelected ? <IndeterminateCheckBoxIcon color="error"/> : <AddBoxIcon color="primary" /> }
                                </IconButton>
                              }
                            </TableCell>
                            {header.map((header, count, list) => (
                                count===0 ? 
                                <TableCell component="th" id={labelId} scope="row" padding="none" key={header.id} >
                                  {header.link ? <RouterLink  to={header.route+row.id} className="clt-row" key={row.id}>{row[header.id]}</RouterLink> : row[header.id]}
                                </TableCell> :
                                <TableCell
                                    align="left"
                                    key={header.id}
                                    colSpan={count===list.length-1 ? 2 : 1}
                                >
                                  {header.link ? <RouterLink  to={header.route+row.id} className="clt-row" key={row.id}>{row[header.id]}</RouterLink> : 
                                    header.input ? 
                                    <EditableCell
                                      value={row[header.id]}
                                      updateMyData={handleFieldUpdate}
                                      row={row}
                                      column={header.id}
                                    />
                                     : 
                                    row[header.id]}
                                </TableCell>
                                ))}
                        </TableRow>
                        );
                    })}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </PerfectScrollbar>
    </Card>
  );
}
EnhancedTable.propTypes = {
    className: PropTypes.string,
    header: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
}
export default React.memo(EnhancedTable);