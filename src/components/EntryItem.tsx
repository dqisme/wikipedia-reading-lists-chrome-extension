import React, { useState } from "react";
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';

import { Entry } from '../types'
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import EntryService from "../services/EntryService";

interface Props {
  listId: number
  entry: Entry,
}

const EntryItem: React.FC<Props> = props => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [openSnack, setOpenSnack] = useState(false);
  const [msgSnack, setMsgSnack] = useState("")

  const handListItemClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    window.chrome.tabs.create({
      active: true,
      url: encodeURI(`${props.entry.project}/wiki/${props.entry.title}`)
    })
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(null)
  }

  const handleMenuItemClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(`--- Deleting entry id:${props.entry.id} ---`)
    const msg: string = await EntryService.deleteEntryFromList(props.listId, props.entry.id, props.entry.title)
    setOpenSnack(true)
    setMsgSnack(msg)
  }

  return (
    <>
      <ListItem button onClick={handListItemClick}>
        <ListItemText
          primary={props.entry.title}
          primaryTypographyProps={{ noWrap: true }}
          secondary={new Date(props.entry.created).toLocaleString()}
        />

        <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuItemClick}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <Typography variant="body2">Delete</Typography>
          </MenuItem>
        </Menu >
      </ListItem>

      <Snackbar
        open={openSnack}
        autoHideDuration={2000}
        onClose={() => {
          setOpenSnack(false)
          setMsgSnack("")
        }}
        message={msgSnack}
      />
    </>
  )
}

export default EntryItem