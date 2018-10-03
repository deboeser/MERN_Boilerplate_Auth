import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { mailFolderListItems, otherMailFolderListItems } from "./tileData";

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  }
});

const NavDrawer = props => {
  const { classes, theme } = props;

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classNames(
          classes.drawerPaper,
          !props.open && classes.drawerPaperClose
        )
      }}
      open={props.open}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List>{mailFolderListItems(props.auth.isAuthenticated)}</List>
      <Divider />
      <List>{otherMailFolderListItems}</List>
      <Divider />
    </Drawer>
  );
};

NavDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  )
)(NavDrawer);
