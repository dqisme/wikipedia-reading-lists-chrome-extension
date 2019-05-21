import React, { useState } from 'react';
import _ from 'lodash';
import useEntries from './hooks/useEntries';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyle, { WithStyles } from '@material-ui/core/styles/withStyles';
import grey from '@material-ui/core/colors/grey';

const styles = () =>
  createStyles({
    list: {
      minWidth: 320,
      maxHeight: 480,
      overflowY: 'auto',
    },
    progress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
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
    emptyText: {
      color: grey[400],
      padding: 16,
    },
  });

const App: React.FC<WithStyles<typeof styles>> = (props) => {
  const [searchText, setSearchText] = useState("");
  const { entries, isFetching } = useEntries(searchText);
  return (
    <>
      {isFetching && <LinearProgress className={props.classes.progress} />}
      <Paper className={props.classes.search} elevation={0}>
        <SearchIcon />
        <InputBase
          autoFocus
          placeholder="Search Entry"
          className={props.classes.searchInput}
          onChange={event => setSearchText(event.target.value)}
        />
      </Paper>
      <List className={props.classes.list} disablePadding dense>
        {_.isEmpty(entries) ? (
          <Typography align="center" className={props.classes.emptyText}>
            No Entries Here.
          </Typography>
        ) :
        entries.map(entry => (
          <ListItem key={entry.title} button onClick={() => window.chrome.tabs.create({ active: true, url: encodeURI(`${entry.project}/wiki/${entry.title}`) })}>
            <ListItemText
              primary={entry.title}
              primaryTypographyProps={{ noWrap: true }}
              secondary={new Date(entry.created).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default withStyle(styles)(App);
