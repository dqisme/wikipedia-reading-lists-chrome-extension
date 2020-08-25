import React from 'react'
import _ from 'lodash'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import { createStyles } from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'
import { EntryList } from '../types'
import FolderItem from './FolderItem'

interface Props extends WithStyles<typeof styles> {
  data: Array<EntryList>,
  loading: boolean,
  listMode: boolean,
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
  })

const EntryListComponent: React.FC<Props> = props => {
  return (
    <List className={props.classes.list} disablePadding dense>
      {
        _.isEmpty(props.data) ?
          (
            <Typography align="center" className={props.classes.emptyText}>
              {props.loading ? 'Loading...' : 'No Entries Here.'}
            </Typography>
          ) :
          (props.listMode ? null :
            (_.chain(props.data)
              .map(entryList =>
                <FolderItem key={entryList.listId} name={entryList.name} entries={entryList.entries} />
              )
            ).value()
          )
      }
    </List>
  )
}

export default withStyles(styles)(EntryListComponent)