import React, { Component } from "react";
import { connect } from "react-redux";

import Snackbar from "@material-ui/core/Snackbar";

import { triggerSnack } from "../../actions/snackActions";
import SnackbarWrapper from "../common/SnackbarWrapper";

class Snack extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.snack) {
      this.setState({ snack: nextProps.snack });
    }
  }

  openSnack = newSnack => {
    this.props.triggerSnack(newSnack);
  };

  closeSnack = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.triggerSnack({ type: "", msg: "" });
  };

  render() {
    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={this.props.snack.open}
          autoHideDuration={this.props.snack.duration}
          onClose={this.closeSnack}
        >
          <SnackbarWrapper
            onClose={this.closeSnack}
            variant={this.props.snack.type}
            message={this.props.snack.msg}
          />
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  snack: state.snack
});

const mapDispatchToProps = {
  triggerSnack
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Snack);
