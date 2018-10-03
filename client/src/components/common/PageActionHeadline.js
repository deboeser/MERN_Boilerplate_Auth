import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = {
  headline: {
    flex: 1
  },
  actionButton: {
    float: "Right"
  }
};

const PageActionHeadline = props => {
  const { classes, headline, buttonAction, buttonText } = props;
  let actionButton;

  if (props.buttonAction) {
    actionButton = (
      <Button
        variant="contained"
        color="primary"
        onClick={buttonAction}
        className={classes.actionButton}
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <div>
      <Typography variant="display1" gutterBottom>
        {headline}
        {actionButton}
      </Typography>
    </div>
  );
};

PageActionHeadline.propTypes = {
  headline: PropTypes.string.isRequired,
  buttonAction: PropTypes.func,
  buttonText: PropTypes.string
};

export default withStyles(styles)(PageActionHeadline);
