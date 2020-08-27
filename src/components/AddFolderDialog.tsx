import React, { useState } from "react";

import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { Dialog, DialogContent, TextField, DialogActions, Button } from '@material-ui/core'

import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

import EntryService from "../services/EntryService"

interface Props {

}

const AddFolderDialog: React.FC<Props> = props => {
  const [openSnack, setOpenSnack] = useState(false);
  const [msgSnack, setMsgSnack] = useState("")

  const [openDialog, setOpenDialog] = useState(false)

  const [name, setName] = useState('')
  // TODO: won't support description right now
  // const [description, setDescription] = useState('')

  const handleOpenClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setOpenDialog(true)
  }

  const handleCloseClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setName('')
    setOpenDialog(false)
  }


  return (
    <>
      <MenuItem onClick={handleOpenClick}>
        <ListItemIcon>
          <CreateNewFolderIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="body2">Create new list</Typography>
      </MenuItem>

      <Dialog open={openDialog} onClose={handleCloseClick} aria-labelledby="form-dialog-title">
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name of the list"
            type="text"
            fullWidth
            onChange={event => setName(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClick} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            disabled={!name}
            onClick={
              async (event) => {
                event.preventDefault()
                event.stopPropagation()

                console.log(`--- Creating new list ${name} ---`)
                const msg: string = await EntryService.addNewList(name)
                setName('')
                setOpenDialog(false)
                setOpenSnack(true)
                setMsgSnack(msg)
              }
            }>
            OK
          </Button>
        </DialogActions>
      </Dialog>

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

export default AddFolderDialog

