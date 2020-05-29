import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Badge } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

const useStyles = (props) =>
  makeStyles((theme) => ({
    root: {
      marginRight: props.marginRight ? theme.spacing(1) : 0,
    },
  }));

// Custom props:
// props.picture (string) => image src, if falsy, renders PersonIcon
// props.marginRight (bool) => sets default marginRight

export default function Thumbnail(props) {
  const classes = useStyles(props)();
  const { picture } = props.user;

  return (
    <Badge color="primary" variant="dot" invisible={props.invisible}>
      <Avatar src={picture ? picture : ''} {...props}>
        {!picture && <PersonIcon />}
      </Avatar>
    </Badge>
  );
}
