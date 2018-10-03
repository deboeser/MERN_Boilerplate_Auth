import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import standardTagConfiguration from "../common/standardTagConfiguration";
import { triggerSnack } from "../../actions/snackActions";
import { loadUserTags, deleteTag, setTag } from "../../actions/tagActions";

const styles = theme => ({
  card: {
    position: "relative",
    width: "100%",
    height: "100%",
    margin: theme.spacing.unit * 0,
    display: "inline-block",
    marginBottom: 48
  },
  chip: {
    margin: theme.spacing.unit * 0.25
  },
  exampleWrapper: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  preview: {
    backgroundColor: "#F2F2F2"
  },
  media: {
    height: 140
  },
  cardAction: {
    position: "absolute",
    bottom: 0
  },
  ...standardTagConfiguration(theme)
});

class ColorTag extends Component {
  constructor(props) {
    super(props);
  }

  onDeleteClick = () => {
    this.props.deleteTag(this.props.id, () => {
      this.props.loadUserTags();
      this.props.triggerSnack({
        type: "success",
        msg: "Tag was deleted successfully",
        duration: 4000
      });
    });
  };

  onEditClick = () => {
    this.props.setTag(this.props.tag);
    this.props.handleClickOpen();
  };

  render() {
    const { classes, tag, id } = this.props;

    const textHightlightClasses = classNames(
      classes.example,
      classes[tag.background + "Light"],
      classes[tag.color],
      tag.underlined && classes.textUnderlined,
      tag.bold && classes.textBold,
      tag.bigger && classes.textBigger
    );

    const phraseChips = tag.phrases.map((phrase, key) => (
      <Chip label={phrase} key={key} className={classes.chip} />
    ));

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {tag.tagname}
            </Typography>
          </CardContent>
          <CardContent className={classes.preview}>
            <Typography className={classes.exampleWrapper}>
              This is an <span className={textHightlightClasses}>example</span>{" "}
              text that shows how this color text looks like in a plain text{" "}
              <span className={textHightlightClasses}>example</span>.
            </Typography>
          </CardContent>
          <CardContent>{phraseChips}</CardContent>
          <CardActions className={classes.cardAction}>
            <Button size="small" color="primary" onClick={this.onDeleteClick}>
              Delete
            </Button>
            <Button size="small" color="primary" onClick={this.onEditClick}>
              Edit
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

ColorTag.propTypes = {
  classes: PropTypes.object.isRequired,
  tag: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  loadUserTags: PropTypes.func.isRequired,
  deleteTag: PropTypes.func.isRequired,
  setTag: PropTypes.func.isRequired,
  triggerSnack: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  loadUserTags,
  deleteTag,
  setTag,
  triggerSnack
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    null,
    mapDispatchToProps
  )
)(ColorTag);
