import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { compose } from "redux";

import { Link } from "react-router-dom";
import Countdown from "react-countdown-now";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  progress: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    textAlign: "center"
  },
  headline: {
    marginBottom: theme.spacing.unit * 2
  },
  form: {
    marginBottom: theme.spacing.unit * 1,
    marginTop: theme.spacing.unit * 2
  },
  textfield: {
    marginBottom: theme.spacing.unit * 2
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  }
});

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>00:00</span>;
  } else if (minutes >= 2) {
    return <span>{minutes} minutes</span>;
  } else if (minutes == 0) {
    return (
      <span>
        {seconds} second
        {seconds == 1 ? "" : "s"}
      </span>
    );
  } else {
    return (
      <span>
        {minutes} minute
        {minutes == 1 ? "" : "s"} and {seconds} second
        {seconds == 1 ? "" : "s"}
      </span>
    );
  }
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otp: "",
      passwordNew1: "",
      passwordNew2: "",
      pwReset: false,
      isValid: false,
      validUntil: null,
      validLoading: true,
      resetLoading: false,
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/app");
    }
    axios
      .get(`/api/auth/reset-password/is-valid/${this.props.match.params.token}`)
      .then(res => {
        this.setState({
          validLoading: false,
          isValid: !isEmpty(res.data.validUntil),
          validUntil: res.data.validUntil
        });
      })
      .catch(err =>
        this.setState({
          validLoading: false,
          isValid: false,
          errors: err.response.data
        })
      );
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.setState({ resetLoading: true });
    const resetRequest = {
      otp: this.state.otp,
      passwordNew1: this.state.passwordNew1,
      passwordNew2: this.state.passwordNew2
    };
    axios
      .post(
        `/api/auth/reset-password/${this.props.match.params.token}`,
        resetRequest
      )
      .then(res => {
        this.setState({ pwReset: true, resetLoading: false });
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          resetLoading: false,
          isValid: isEmpty(err.response.data.expired)
        });
      });
  };

  countdownComplete = () => {
    this.setState({ isValid: false });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    let content;
    let attempts;

    if (!isEmpty(this.state.errors.remaining)) {
      attempts = (
        <Typography align="left" gutterBottom>
          You have {this.state.errors.remaining} more attempts to enter the
          correct OTP.
        </Typography>
      );
    }

    if (this.state.validLoading) {
      content = (
        <div className={classes.progress}>
          <CircularProgress />
        </div>
      );
    } else if (!this.state.isValid) {
      content = (
        <div>
          <Typography align="left" gutterBottom>
            Your reset link is invalid. Please request a new link.
          </Typography>
          <Link to="/forgot-password">
            <Button
              className={classes.submit}
              variant="contained"
              color="primary"
              fullWidth
            >
              Request new Link
            </Button>
          </Link>
        </div>
      );
    } else if (!this.state.pwReset) {
      content = (
        <div>
          <Typography align="left" gutterBottom>
            Please enter your OTP and choose a new password within the next{" "}
            <Countdown
              date={this.state.validUntil}
              zeroPadLength={1}
              renderer={renderer}
              onComplete={this.countdownComplete}
            />
            .
          </Typography>
          {attempts}
          <form onSubmit={this.onSubmit} className={classes.form}>
            <TextField
              className={classes.textfield}
              name="otp"
              label="One Time Password (OTP)"
              error={!isEmpty(errors.otp)}
              helperText={errors.otp}
              onChange={this.onChange.bind(this)}
              fullWidth
            />
            <TextField
              type="password"
              className={classes.textfield}
              name="passwordNew1"
              label="New Password"
              error={!isEmpty(errors.passwordNew1)}
              helperText={errors.passwordNew1}
              onChange={this.onChange.bind(this)}
              fullWidth
            />
            <TextField
              type="password"
              className={classes.textfield}
              name="passwordNew2"
              label="Confirm New Password"
              error={!isEmpty(errors.passwordNew2)}
              helperText={errors.passwordNew2}
              onChange={this.onChange.bind(this)}
              fullWidth
            />
            <div className={classes.submit}>
              <LoadingButton
                type="submit"
                loading={this.state.resetLoading}
                variant="contained"
                color="primary"
                fullWidth
              >
                Reset Password
              </LoadingButton>
            </div>
          </form>
        </div>
      );
    } else if (this.state.pwReset) {
      content = (
        <div>
          <Typography align="left" gutterBottom>
            Your password was changed successfully. You can now login again!
          </Typography>
          <Link to="/app">
            <Button
              className={classes.submit}
              variant="contained"
              color="primary"
              fullWidth
            >
              Go to App
            </Button>
          </Link>
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
  connect(
    mapStateToProps,
    null
  ),
  withStyles(styles, { withTheme: true })
)(ResetPassword);
