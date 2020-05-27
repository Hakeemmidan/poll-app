import React from 'react';
import { UserContext } from './UserContext';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Grid,
  Link,
  Menu,
  MenuItem,
  Button,
  IconButton,
  Hidden,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import Thumbnail from './Thumbnail';
import NavDrawer from './NavDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    height: theme.spacing(10),
    color: theme.palette.common.black,
  },
  grid: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(1)}px`,
    '& > div': {
      display: 'flex',
      alignItems: 'center',
    },
  },
  logo: {
    flexGrow: 1,
  },
}));

export default function NavBar(props) {
  const user = React.useContext(UserContext);
  const classes = useStyles();

  const [state, setState] = React.useState({
    isDrawerOpen: false,
    anchorEl: null, // This is required for Menu Component
  });

  function toggleDrawer() {
    setState({
      ...state,
      isDrawerOpen: !state.isDrawerOpen,
    });
  }

  function openProfileMenu(e) {
    setState({
      ...state,
      isDrawerOpen: false,
      anchorEl: e.currentTarget,
    });
  }

  function closeProfileMenu(e) {
    setState({
      ...state,
      isDrawerOpen: false,
      anchorEl: null,
    });
  }

  return (
    <>
      <NavDrawer isOpen={state.isDrawerOpen} toggleDrawer={toggleDrawer} />
      <AppBar className={classes.root}>
        <Grid container className={classes.grid} spacing={5}>
          <Hidden smDown>
            <Grid item className={classes.logo}>
              [LOGO HERE]
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/friends">
                Friends
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/friends-polls">
                Friends' Polls
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/opinions">
                Opinions
              </Link>
            </Grid>
          </Hidden>
          <Hidden xsDown>
            <Grid item>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/create-poll"
              >
                Create Poll
              </Button>
            </Grid>
          </Hidden>
          <Grid item>
            <Button
              aria-controls="simple-menu"
              aria-haspopup="true"
              className={classes.link}
              onClick={openProfileMenu}
            >
              <Thumbnail marginRight={true} picture={user.picture} />
              My Profile
            </Button>
            <Menu
              id="simple-menu"
              keepMounted
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              anchorEl={state.anchorEl}
              open={!!state.anchorEl}
              onClose={closeProfileMenu}
            >
              <MenuItem component={RouterLink} to="/dashboard">
                Profile
              </MenuItem>
              <MenuItem component="a" onClick={user.logout}>
                Logout
              </MenuItem>
            </Menu>
          </Grid>
          <Hidden mdUp>
            <Grid item>
              <IconButton variant="outlined" onClick={toggleDrawer}>
                <MenuIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Hidden>
        </Grid>
      </AppBar>
    </>
  );
}