import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";

import PropTypes from "prop-types";

import { loadUserTags, setTag } from "../../actions/tagActions";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import ColorTag from "./ColorTag";
import CreateTagDialog from "./CreateTagDialog";
import { colorClasses } from "../common/colors";

const styles = theme => ({
  grid: {
    marginTop: theme.spacing.unit * 2
  }
});

class ColorTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dialogOpen: false,
      loading: true,
      tags: []
    };
  }

  componentDidMount() {
    this.props.loadUserTags();
    this.setState({ tags: this.props.tags.tags });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tags) {
      this.setState({
        tags: nextProps.tags.tags,
        loading: nextProps.tags.loading
      });
    }
  }

  handleClickOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
    this.props.setTag({});
  };

  render() {
    const { tags, loading } = this.state;
    const { classes } = this.props;

    let colorTags;

    if (loading) {
      colorTags = <LinearProgress />;
    } else {
      if (tags.length === 0) {
        colorTags = <span>You do not have any tags yet!! </span>;
      } else {
        colorTags = (
          <Grid container className={classes.grid} spacing={16}>
            {tags.map(tag => (
              <ColorTag
                key={tag._id}
                id={tag._id}
                tag={tag}
                handleClickOpen={this.handleClickOpen}
              />
            ))}
          </Grid>
        );
      }
    }

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Your Color Tags
        </Typography>
        <Button onClick={this.handleClickOpen}>New Tag</Button>
        <CreateTagDialog
          state={this.state.dialogOpen}
          handleClose={this.handleClose}
        />
        <Typography gutterBottom>
          These are your color tags. When importing abstracts or papers, onverio
          will highlight the key phrases that you define in each tag according
          to the format of the tag.
        </Typography>
        {colorTags}
      </div>
    );
  }
}

ColorTags.propTypes = {
  tags: PropTypes.object.isRequired,
  loadUserTags: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tags: state.tags
});

const mapDispatchToProps = {
  loadUserTags,
  setTag
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ColorTags);
