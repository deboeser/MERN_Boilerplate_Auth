import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

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

export default withStyles(styles)(AuthPage);
