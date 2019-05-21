import React from 'react';
import useAllEntries from './hooks/useAllEntries';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyle, { WithStyles } from '@material-ui/core/styles/withStyles';

const styles = () =>
  createStyles({
    list: {
      minWidth: 320,
    },
    progress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
  });

const App: React.FC<WithStyles<typeof styles>> = (props) => {
  const { allEntries, isFetching } = useAllEntries();
  return (
    <>
      {isFetching && <LinearProgress className={props.classes.progress} />}
      <List className={props.classes.list}>
        {allEntries.map(entry => (
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
