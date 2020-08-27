import React, { useState } from 'react'

import _ from 'lodash'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse';

import { ListItemIcon, MenuItem, Menu, Typography, IconButton, Snackbar } from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';

import { Entry } from '../types'
import EntryItem from "./EntryItem";
import EntryService from '../services/EntryService';

interface Props {
  listId: number
  name: string,
  entries: Array<Entry>
}

const FolderItem: React.FC<Props> = props => {
  const [open, setOpen] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const [openSnack, setOpenSnack] = useState(false);
  const [msgSnack, setMsgSnack] = useState("")

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

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

  const handleDeleteListClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    console.log(`--- Deleting list id:${props.listId} ---`)
    const msg: string = await EntryService.deleteThisList(props.listId, props.name)
    setOpenSnack(true)
    setMsgSnack(msg)
  }

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText
          primary={props.name}
          primaryTypographyProps={{ noWrap: true }}
          secondary={`${props.entries.length} articles`}
        />

        {
          open ? (
            <>
              <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleMenuClick}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >

                <MenuItem onClick={handleDeleteListClick}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="body2">Delete list</Typography>
                </MenuItem>
              </Menu >

              <ExpandLess />
            </>
          ) : (<ExpandMore />)
        }

      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {
          (_.chain(props.entries)
            .uniqBy(entry => entry.title)
            .orderBy(entry => new Date(entry.created), 'desc')
            .map(entry => <EntryItem key={entry.id} entry={entry} listId={props.listId} />)
          ).value()
        }
      </Collapse>

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

export default FolderItem