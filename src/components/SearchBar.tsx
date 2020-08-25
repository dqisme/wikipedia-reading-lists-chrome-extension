import React from 'react';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';

import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
import AddMenu from './AddMenu';
import { EntryList } from '../types';

interface Props extends WithStyles<typeof styles> {
  onChange: Function,
  lists: Array<EntryList>
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
    searchIcon: {
      paddingLeft: 12
    }
  });

const SearchBar: React.FC<Props> = props => (
  <Grid container spacing={8}>
    <Grid item xs={10}>
      <Paper className={props.classes.search} elevation={0}>
        <SearchIcon className={props.classes.searchIcon} />
        <InputBase
          autoFocus
          placeholder="Search Entry"
          className={props.classes.searchInput}
          onChange={event => props.onChange(event.target.value)}
        />
      </Paper>
    </Grid>

    <Grid item xs={2}>
      <AddMenu lists={props.lists} />
    </Grid>
  </Grid >
);

export default withStyles(styles)(SearchBar);
