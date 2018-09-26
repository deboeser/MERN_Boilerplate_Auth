import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import AuthSwitcher from "./AuthSwitcher";

const styles = theme => ({
  layout: {
    marginTop: theme.spacing.unit * 8,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  paper: {
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto"
  }
});

class AuthPage extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.layout}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <AuthSwitcher />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    null
  )
)(withRouter(AuthPage));
