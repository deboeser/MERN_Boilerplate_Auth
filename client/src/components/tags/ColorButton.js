import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

import { backgroundColorHoverClasses, colors } from "../common/colors";

const styles = theme => ({
  boundingBox: {
    position: "relative",
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5,
    display: "inline-block"
  },
  circle: {
    position: "absolute",
    width: theme.spacing.unit * 3 - 4,
    height: theme.spacing.unit * 3 - 4,
    margin: theme.spacing.unit * 1,
    borderRadius: theme.spacing.unit * 1.5,
    border: "2px solid #000",
    transition: "all 0.2s ease 0s"
  },
  tag: {
    position: "absolute",
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
    borderRadius: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 0.5,
    transition: "all 0.1s ease 0s"
  },
  selectedNew: {
    width: theme.spacing.unit * 5 - 4,
    height: theme.spacing.unit * 5 - 4,
    margin: 0,
    borderRadius: theme.spacing.unit * 2.5
  },
  ...backgroundColorHoverClasses("", 500, 700),
  ...backgroundColorHoverClasses("Light", 100, 200),
  ...backgroundColorHoverClasses("Dark", 800, 900)
});

const ColorButton = props => {
  const { classes, value, color, suffix } = props;

  const colorClassNames = colors.map(
    colorItem => (colorItem === color ? classes[colorItem + suffix] : null)
  );

  return (
    <div className={classes.boundingBox}>
      <div
        className={classnames(
          classes.circle,
          value === color && classes.selectedNew
        )}
      />
      <div
        onClick={props.selectClick}
        title={color}
        className={classnames(classes.tag, ...colorClassNames)}
      />
    </div>
  );
};

ColorButton.defaultProps = {
  suffix: ""
};

ColorButton.propTypes = {
  value: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  suffix: PropTypes.oneOf(["", "Light", "Dark"]).isRequired
};

export default withStyles(styles, { withTheme: true })(ColorButton);
