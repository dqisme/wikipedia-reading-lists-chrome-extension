import React from 'react';
import _ from 'lodash';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

interface Entry {
  project: string,
  created: string,
  title: string,
}

interface Props extends WithStyles<typeof styles> {
  data: Array<Entry>,
  isFetching: boolean,
}

const styles = () =>
  createStyles({
    list: {
      minWidth: 320,
      maxHeight: 480,
      overflowY: 'auto',
    },
    emptyText: {
      color: grey[400],
      padding: 16,
    },
  });

const EntryList: React.FC<Props> = props => {
  return (
    <List className={props.classes.list} disablePadding dense>
      {_.isEmpty(props.data) ? (
        <Typography align="center" className={props.classes.emptyText}>
          {props.isFetching ? 'Loading...' : 'No Entries Here.'}
        </Typography>
      ) :
        props.data.map(entry => (
          <ListItem key={entry.title} button onClick={() => window.chrome.tabs.create({ active: true, url: encodeURI(`${entry.project}/wiki/${entry.title}`) })}>
            <ListItemText
              primary={entry.title}
              primaryTypographyProps={{ noWrap: true }}
              secondary={new Date(entry.created).toLocaleString()}
            />
          </ListItem>
        ))}
    </List>
  )
};

export default withStyles(styles)(EntryList);