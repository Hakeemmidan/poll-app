import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Hidden, Container } from '@material-ui/core';

import Friends from './Friends';
import Polls from './Polls';
import FriendsLists from './FriendsLists';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(10),
    marginRight: 0,
    minHeight: '100vh',
    display: 'flex',
  },
  leftSide: {
    width: 200,
    paddingTop: theme.spacing(5),
    borderRight: `1px solid ${theme.palette.grey[200]}`,
    height: '100%',
  },
  rightSide: {
    width: `calc(100% - 200px)`,
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1,
  },
}));

export default function Dashboard(props) {
  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Grid container>
        <Hidden smDown>
          <Grid item className={classes.leftSide}>
            <Friends />
          </Grid>
        </Hidden>
        <Grid item className={classes.rightSide}>
          <Polls />
          <FriendsLists />
        </Grid>
      </Grid>
    </Container>
  );
}
