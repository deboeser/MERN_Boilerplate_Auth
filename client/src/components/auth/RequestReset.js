import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import isEmpty from "../../validation/is-empty";
import LoadingButton from "../common/LoadingButton";
import axios from "axios";

const styles = theme => ({
  layout: {
    marginTop: theme.spacing.unit * 12,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3
  },
  paper: {
    maxWidth: 400,
    marginLeft: "auto",
    marginRight: "auto",
    padding: theme.spacing.unit * 3
  },
  headline: {
    marginBottom: theme.spacing.unit * 2
  },
  textfield: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  }
});

class RequestReset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      email: "",
      resetSent: false,
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/app");
    }
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    axios
      .post("/api/auth/reset-password", { email: this.state.email })
      .then(res => {
        this.setState({ loading: false, resetSent: true, errors: {} });
      })
      .catch(err => {
        this.setState({
          loading: false,
          errors: err.response.data
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    let content;

    if (this.state.resetSent) {
      content = (
        <Typography align="left" gutterBottom>
          We have sent you an email with a link to reset your password. Hang
          tight! You will soon be back on onverio.
        </Typography>
      );
    } else {
      content = (
        <div>
          <Typography align="left" gutterBottom>
            Submit your email address and we will send you a link to reset your
            password.
          </Typography>
          <form onSubmit={this.onSubmit} className={classes.form}>
            <TextField
              className={classes.textfield}
              name="email"
              label="Email Address"
              error={!isEmpty(errors.email)}
              helperText={errors.email}
              onChange={this.onChange.bind(this)}
              fullWidth
            />
            <div className={classes.submit}>
              <LoadingButton
                type="submit"
                loading={this.state.loading}
                variant="contained"
                color="primary"
                fullWidth
              >
                Request Reset Link
              </LoadingButton>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className={classes.layout}>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography
                className={classes.headline}
                variant="headline"
                align="left"
                gutterBottom
              >
                Reset onverio Password
              </Typography>
              {content}
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
)(withRouter(RequestReset));
