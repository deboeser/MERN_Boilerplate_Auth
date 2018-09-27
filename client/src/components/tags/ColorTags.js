import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { loadUserTags } from "../../actions/tagActions";

import Typography from "@material-ui/core/Typography";

import ColorTag from "./ColorTag";

class ColorTags extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    const { tags, loading } = this.state;

    let colorTags;

    if (loading) {
      colorTags = <span>Loading...</span>;
    } else {
      if (tags.length === 0) {
        colorTags = <span>You do not have any tags yet!! </span>;
      } else {
        colorTags = tags.map(tag => (
          <ColorTag key={tag._id} tagname={tag.tagname} id={tag._id} />
        ));
      }
    }

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Your Color Tags
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
  loadUserTags
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColorTags);
