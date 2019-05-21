import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import { createStyles } from '@material-ui/core';

interface Props extends WithStyles<typeof styles> {
  isFetching: boolean,
}

const styles = () =>
  createStyles({
    progress: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
  });

const NetworkIndicator: React.FC<Props> = props => (
  props.isFetching ? <LinearProgress className={props.classes.progress} /> : null
);

export default withStyles(styles)(NetworkIndicator);