import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import CreateTag from "./CreateTag";
import { addTag, loadUserTags } from "../../actions/tagActions";
import isEmpty from "../../validation/is-empty";

class CreateTagDialog extends React.Component {
  constructor(props) {
    super(props);

    this.createTag = {};
  }

  onSubmit = () => {
    const newTag = {
      ...this.createTag.state,
      phrases: this.createTag.state.phrases.join(",")
    };
    this.props.addTag(newTag, () => {
      this.props.handleClose();
      this.props.loadUserTags();
    });
  };

  setCreateTagState = e => {
    this.createTag = e;
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.state}
          onClose={this.props.handleClose}
          scroll="paper"
        >
          <DialogTitle id="scroll-dialog-title">Add Color Tag</DialogTitle>
          <DialogContent>
            <CreateTag exportSelf={this.setCreateTagState} />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.onSubmit} color="primary">
              {isEmpty(this.props.tag) ? "Add Tag" : "Save Tag"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

CreateTagDialog.propTypes = {
  state: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tag: state.tags.tag
});

const mapDispatchToProps = {
  addTag,
  loadUserTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTagDialog);
