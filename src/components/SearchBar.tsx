import React from 'react';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

interface Props extends WithStyles<typeof styles> {
  onChange: Function,
}

const styles = () =>
  createStyles({
    search: {
      backgroundColor: grey[200],
      color: grey[800],
      display: 'flex',
      alignItems: 'center',
      padding: 4,
      marginBottom: 4,
    },
    searchInput: {
      marginLeft: 8,
    },
  });

const SearchBar: React.FC<Props> = props => (
  <Paper className={props.classes.search} elevation={0}>
    <SearchIcon />
    <InputBase
      autoFocus
      placeholder="Search Entry"
      className={props.classes.searchInput}
      onChange={event => props.onChange(event.target.value)}
    />
  </Paper>
);

export default withStyles(styles)(SearchBar);