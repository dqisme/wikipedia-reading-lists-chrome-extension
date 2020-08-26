import React, { useState } from "react";

import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles'
import { createStyles } from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

import { EntryList } from "../types";

import EntryService from "../services/EntryService"

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
  const [openSnack, setOpenSnack] = useState(false);
  const [msgSnack, setMsgSnack] = useState("")

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick}>
        <AddIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <Typography variant="caption" gutterBottom className={props.classes.captionNote}>
          Add to reading list
        </Typography>
        <Divider light />

        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <CreateNewFolderIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2">NOT WORKING</Typography>
        </MenuItem>

        {
          props.lists.map(list =>
            <MenuItem key={list.listId} onClick={
              async (event) => {
                event.preventDefault()
                event.stopPropagation()
                console.log(`--- Adding to ${list.listId} ---`)
                const msg: string = await EntryService.addEntryToList(list.listId, list.name)
                setOpenSnack(true)
                setMsgSnack(msg)
              }
            }
            >
              <Typography variant="body2">{list.name}</Typography>
            </MenuItem>
          )
        }
      </Menu >

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => {
          setOpenSnack(false)
          setMsgSnack("")
        }}
        message={msgSnack}
      />
    </div >
  )
}

export default withStyles(styles)(AddMenu)
