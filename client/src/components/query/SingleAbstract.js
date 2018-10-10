import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { loadUserTags } from "../../actions/tagActions";
import classNames from "classnames";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import PageActionHeadline from "../common/PageActionHeadline";
import isEmpty from "../../validation/is-empty";
import standardTagConfiguration from "../common/standardTagConfiguration";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  btn: {
    marginTop: theme.spacing.unit
  },
  ...standardTagConfiguration(theme)
});

class SingleAbstract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightText: "",
      textSplit: []
    };
  }

  componentDidMount() {
    if (isEmpty(this.props.tags.tags)) {
      this.props.loadUserTags();
    }
  }

  onChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  onTransferClick = text => {
    let textChars = text.split("");
    textChars = textChars.map(item => {
      return {
        char: item,
        classes: []
      };
    });

    this.props.tags.appliedTags.forEach(tag => {
      let tmpResult = new Array();
      tag.phrases.forEach(phrase => {
        let regEx = new RegExp(phrase, "gi");
        while (regEx.exec(text)) {
          tmpResult.push([regEx.lastIndex - phrase.length, regEx.lastIndex]);
        }
      });
      tmpResult.forEach(finding => {
        for (var i = finding[0]; i < finding[1]; i++) {
          textChars[i].classes.push(...tag.classes);
        }
      });
    });

    textChars = textChars.map(item => {
      return {
        char: item.char,
        classes: item.classes.join(" ")
      };
    });

    let result = [];
    let classes = textChars[0].classes;
    let start = 0;

    for (var i = 0; i < textChars.length; i++) {
      if (!(classes == textChars[i].classes)) {
        result.push({
          text: text.substring(start, i),
          classes: classes
        });
        start = i;
        classes = textChars[i].classes;
      }
    }

    result.push({
      text: text.substring(start, textChars.length),
      classes: classes
    });

    this.setState({ textSplit: result });
  };

  render() {
    const { classes } = this.props;
    let text;

    const htmlresult = this.state.textSplit.map((item, key) => {
      let textHightlightClasses;
      if (!isEmpty(item.classes)) {
        textHightlightClasses = classNames(
          ...item.classes.split(" ").map(item => classes[item])
        );
      }
      return (
        <span key={key} className={textHightlightClasses}>
          {item.text}
        </span>
      );
    });

    if (isEmpty(this.state.highlightText)) {
      text = "Enter some text dude";
    } else {
      text = this.state.highlightText;
    }

    return (
      <div className={classes.root}>
        <PageActionHeadline headline="Coloring Single Text" />

        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} lg={3}>
            <Paper className={classes.paper}>
              <TextField
                name="highlightText"
                label="Your Text"
                value={this.state.text}
                onChange={this.onChange.bind(this)}
                multiline
                fullWidth
              />
              <Button
                className={classes.btn}
                onClick={() => {
                  this.onTransferClick(text);
                }}
                color="primary"
                variant="contained"
                fullWidth
              >
                Cancel
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} lg={9}>
            <Paper className={classes.paper}>
              <Typography>{htmlresult}</Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SingleAbstract.propTypes = {
  loadUserTags: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  loadUserTags
};

const mapStateToProps = state => ({
  tags: state.tags
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { withTheme: true })
)(SingleAbstract);
