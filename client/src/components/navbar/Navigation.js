import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";

// eslint-disable-next-line
import Button from "@material-ui/core/Button";

import { triggerSnack } from "../../actions/snackActions";
import NavBar from "./NavBar";
import NavDrawer from "./NavDrawer";
import CreateTag from "../tags/CreateTag";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    overflowY: "scroll"
  },
  contentBody: {}
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colFont: "",
      colBackground: "",
      underlined: false,
      bold: false,
      open: false,
      dialog: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  openSnack = newSnack => {
    this.props.triggerSnack(newSnack);
  };

  render() {
    const { classes, match } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <NavBar
            open={this.state.open}
            handleDrawerOpen={this.handleDrawerOpen}
          />
          <NavDrawer
            open={this.state.open}
            handleDrawerClose={this.handleDrawerClose}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <div className={classes.contentBody}>
              <Route path={`${match.path}/create-tag`} component={CreateTag} />
              <Button
                onClick={() =>
                  this.openSnack({
                    type: "success",
                    msg: "YEAH",
                    duration: 1000
                  })
                }
              >
                Open success snackbar
              </Button>
            </div>
          </main>
        </div>
      </Router>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  triggerSnack
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Navigation);
