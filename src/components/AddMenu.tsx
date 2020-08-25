import React from "react";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import { createStyles } from '@material-ui/core'

import Divider from '@material-ui/core/Divider';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { ListItem, ListItemText } from "@material-ui/core";
import { EntryList } from "../types";

import AddEntryService from "../services/AddEntryService"

interface Props extends WithStyles<typeof styles> {
  lists: Array<EntryList>
}

const styles = () =>
  createStyles({
    captionNote: {
      paddingLeft: 16
    }
  })

const AddMenu: React.FC<Props> = props => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <AddIcon fontSize="small" />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Typography variant="caption" gutterBottom className={props.classes.captionNote}>
          Add to reading list
        </Typography>
        <Divider light />

        {// TODO: implement create new list (if possible considering API might be broken)
        }
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">Create new</Typography>
        </MenuItem>

        {
          // TODO: implement adding entry to this list - call with listId
          props.lists.map(list =>
            <MenuItem key={list.listId} onClick={
              () => {
                console.log(`Adding to ${list.listId}`)
                AddEntryService.addEntryToList(list.listId)
              }
            }
            >
              {list.name}
            </MenuItem>
          )
        }
      </Menu >
    </div >
  )
}

export default withStyles(styles)(AddMenu)
