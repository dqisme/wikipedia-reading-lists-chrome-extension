import React, { useState } from 'react'

import _ from 'lodash'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse';

import { ListItemIcon } from "@material-ui/core";
import FolderIcon from '@material-ui/icons/Folder';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import { Entry } from '../types'
import EntryItem from "./EntryItem";

interface Props {
  name: string,
  entries: Array<Entry>
}

const FolderItem: React.FC<Props> = props => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

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
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {
          (_.chain(props.entries)
            .uniqBy(entry => entry.title)
            .orderBy(entry => new Date(entry.created), 'desc')
            .map(entry => <EntryItem key={entry.id} entry={entry} />)
          ).value()
        }
      </Collapse>
    </>
  )
}

export default FolderItem