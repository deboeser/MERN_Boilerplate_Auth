import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import { colors, colorsReduced } from "../common/colors";
import ColorButton from "./ColorButton";

const styles = theme => {};

class ColorSelector extends Component {
  constructor(props) {
    super(props);

    let suffix = "";
    if (props.light) {
      suffix = "Light";
    }
    if (props.dark) {
      suffix = "Dark";
    }

    this.suffix = suffix;

    this.state = {
      value: props.value
    };
  }

  onColorClick = e => {
    if (e.target.title === this.state.value) {
      this.setState({ value: "" });
      this.props.onChange(this.props.name, "");
    } else {
      this.setState({ value: e.target.title });
      this.props.onChange(this.props.name, e.target.title);
    }
  };

  render() {
    const { value } = this.state;
    const { reduced } = this.props;

    let ColorButtons;
    let colorArray;

    if (reduced) {
      colorArray = colorsReduced;
    } else {
      colorArray = colors;
    }

    ColorButtons = colorArray.map((color, index) => (
      <ColorButton
        value={value}
        color={color}
        key={index}
        selectClick={this.onColorClick}
        suffix={this.suffix}
      />
    ));

    return <div>{ColorButtons}</div>;
  }
}

ColorSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  light: PropTypes.bool,
  dark: PropTypes.bool,
  reduced: PropTypes.bool
};

ColorSelector.defaultProps = {
  value: "",
  light: false,
  dark: false,
  reduced: false
};

export default withStyles(styles, { withTheme: true })(ColorSelector);
