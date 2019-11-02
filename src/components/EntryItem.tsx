import React from "react";
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Entry } from '../types'

interface Props {
  entry: Entry,
}

const EntryItem: React.FC<Props> = props =>
  <ListItem button onClick={() => window.chrome.tabs.create({
    active: true,
    url: encodeURI(`${props.entry.project}/wiki/${props.entry.title}`)
  })}>
    <ListItemText
      primary={props.entry.title}
      primaryTypographyProps={{ noWrap: true }}
      secondary={new Date(props.entry.created).toLocaleString()}
    />
  </ListItem>

export default EntryItem