import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import withStyles from "@material-ui/core/styles/withStyles";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import isEmpty from "../../validation/is-empty";
import { registerUser } from "../../actions/authActions";
import { triggerSnack } from "../../actions/snackActions";
import LoadingButton from "../common/LoadingButton";

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
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit
  },
  forgot: {
    marginTop: theme.spacing.unit
  }
});

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      password2: "",
      successSnackOpen: false,
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }

  componentDidUpdate() {
    if (!isEmpty(this.state.errors)) {
      this.props.recomputeHeight();
    }
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.registrationSuccess);
  };

  registrationSuccess = () => {
    this.props.triggerSnack({
      type: "success",
      msg: "Registration successful! You can now login."
    });
    this.props.changeToLogin(null, 0);
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;

    return (
      <div className={classes.layout}>
        <Typography variant="headline" align="center">
          Register
        </Typography>
        <form onSubmit={this.onSubmit} className={classes.form}>
          <TextField
            className={classes.textfield}
            name="email"
            label="Email Address"
            onChange={this.onChange.bind(this)}
            error={!isEmpty(errors.email)}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            className={classes.textfield}
            name="password"
            label="Password"
            type="password"
            onChange={this.onChange.bind(this)}
            error={!isEmpty(errors.password)}
            helperText={errors.password}
            fullWidth
          />
          <TextField
            className={classes.textfield}
            name="password2"
            label="Confirm Password"
            type="password"
            onChange={this.onChange.bind(this)}
            error={!isEmpty(errors.password2)}
            helperText={errors.password2}
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
              Register
            </LoadingButton>
          </div>
        </form>
      </div>
    );
  }
}

RegisterForm.propTypes = {
  recomputeHeight: PropTypes.func.isRequired,
  changeToLogin: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = {
  registerUser,
  triggerSnack
};

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(withRouter(RegisterForm));
