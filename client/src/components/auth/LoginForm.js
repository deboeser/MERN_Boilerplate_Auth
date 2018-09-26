import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";

import Typography from "@material-ui/core/Typography";

import isEmpty from "../../validation/is-empty";
import { loginUser } from "../../actions/authActions";
import { triggerSnack } from "../../actions/snackActions";
import LoadingButton from "../common/LoadingButton";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  layout: {},
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  textfield: {
    marginBottom: theme.spacing.unit * 2
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  forgot: {
    marginTop: theme.spacing.unit
  }
});

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidUpdate() {
    if (!isEmpty(this.state.errors)) {
      this.props.recomputeHeight();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const loginData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(loginData, this.loginSuccess);
  };

  loginSuccess = () => {
    this.props.triggerSnack({
      type: "success",
      msg: "You are now logged in.",
      duration: 2000
    });
    this.props.closeDialog();
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <div className={classes.layout}>
        <Typography variant="headline" align="center">
          Sign in
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
          <TextField
            className={classes.textfield}
            name="password"
            type="password"
            label="Password"
            error={!isEmpty(errors.password)}
            helperText={errors.password}
            onChange={this.onChange.bind(this)}
            fullWidth
          />
          <div className={classes.submit}>
            <LoadingButton
              type="submit"
              loading={this.props.auth.loading}
              variant="contained"
              color="primary"
              fullWidth
            >
              Login
            </LoadingButton>
          </div>

          <Typography
            className={classes.forgot}
            variant="caption"
            align="center"
          >
            I forgot my password
          </Typography>
        </form>
      </div>
    );
  }
}

LoginForm.propTypes = {
  recomputeHeight: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  triggerSnack: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

const mapDispatchToProps = {
  loginUser,
  triggerSnack
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(withRouter(LoginForm));
