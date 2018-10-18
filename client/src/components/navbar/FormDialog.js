import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

import AuthSwitcher from "../auth/AuthSwitcher";

const styles = theme => ({
  dialog: {
    paddingTop: `${theme.spacing.unit * 0.5}px !important`,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    maxWidth: theme.singleDialog.width
  }
});

class FormDialog extends React.Component {
  state = {
    open: false
  };

  componentDidMount() {
    if (this.props.externalOpen) {
      this.setState({ open: true });
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.props.resetErrors();
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogContent className={classes.dialog}>
            <AuthSwitcher closeDialog={() => this.handleClose()} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

FormDialog.propTypes = {
  resetErrors: PropTypes.func.isRequired
};

export default withStyles(styles, { withTheme: true })(FormDialog);
