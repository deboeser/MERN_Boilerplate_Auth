import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Button } from "@material-ui/core";

import { resetErrors } from "../../actions/errorActions";
import { logoutUser } from "../../actions/authActions";
import FormDialog from "./FormDialog";

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    paddingRight: 0,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  grow: {
    flexGrow: 1
  },
  headerMenu: {
    marginRight: theme.spacing.unit * 3
  },
  hide: {
    display: "none"
  }
});

class NavBar extends Component {
  componentDidMount() {
    if (this.props.loginOpen) {
      this.setState({ externalOpen: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }

  render() {
    const { classes } = this.props;
    const { isAuthenticated } = this.props.auth;

    let loginDialog;
    let authButtons;

    if (!isAuthenticated) {
      authButtons = (
        <Button color="inherit" onClick={() => loginDialog.handleClickOpen()}>
          Login
        </Button>
      );
    } else {
      authButtons = (
        <Button color="inherit" onClick={() => this.props.logoutUser()}>
          Logout
        </Button>
      );
    }

    return (
      <div>
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.props.open && classes.appBarShift
          )}
        >
          <Toolbar disableGutters={!this.props.open}>
            <IconButton
              color="inherit"
              onClick={this.props.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.props.open && classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap>
              onverio
            </Typography>
            <div className={classes.grow} />
            <div className={classNames(!this.props.open && classes.headerMenu)}>
              {authButtons}
            </div>
          </Toolbar>
        </AppBar>
        <FormDialog
          innerRef={node => {
            loginDialog = node;
          }}
          resetErrors={this.props.resetErrors}
          externalOpen={this.props.externalOpen}
        />
      </div>
    );
  }
}

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  resetErrors,
  logoutUser
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(NavBar);
