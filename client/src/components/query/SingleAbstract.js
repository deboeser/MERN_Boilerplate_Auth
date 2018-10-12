import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { loadUserTags } from "../../actions/tagActions";
import classNames from "classnames";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import LinearProgress from "@material-ui/core/LinearProgress";

import { applyTags } from "../../utils/applyTags";

import PageActionHeadline from "../common/PageActionHeadline";
import isEmpty from "../../validation/is-empty";
import standardTagConfiguration from "../common/standardTagConfiguration";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  doicontrols: {
    display: "flex"
  },
  doifield: {
    flex: "auto"
  },
  doibuttons: {
    flex: "initial"
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  divider: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2
  },
  btn: {
    marginTop: theme.spacing.unit
  },
  btnInline: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: "auto"
  },
  ...standardTagConfiguration(theme)
});

class SingleAbstract extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightText: "",
      doi: "",
      doiError: "",
      hyperlink: "",
      hyperlinkLoading: false,
      abstract: "",
      abstractLoading: false,
      manualAbstractSplit: [],
      retrievedAbstractSplit: []
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

  onTransferClick = (target, text) => {
    applyTags(text, this.props.tags.appliedTags)
      .then(res => this.setState({ [target]: res }))
      .catch(err => console.log("TODO: Handle error: ", err));
  };

  retrieveLink = () => {
    if (isEmpty(this.state.doi)) {
      this.setState({ doiError: "Please enter a DOI" });
    } else {
      this.setState({ doiError: "", hyperlinkLoading: true });

      axios
        .get(`/api/retrieve/doitourl/${this.state.doi}`)
        .then(res => {
          this.setState({
            hyperlinkLoading: false,
            hyperlink: res.data.link
          });
        })
        .catch(err => {
          this.setState({
            hyperlinkLoading: false,
            hyperlink: "Link could not be retrieved"
          });
        });
    }
  };

  retrieveAbstract = () => {
    if (isEmpty(this.state.doi)) {
      this.setState({ doiError: "Please enter a DOI" });
    } else {
      this.setState({ abstractLoading: true, hyperlinkLoading: true });
      axios
        .get(`/api/retrieve/doitoabstract/${this.state.doi}`)
        .then(res => {
          this.setState({
            abstractLoading: false,
            hyperlinkLoading: false,
            hyperlink: res.data.link,
            abstract: res.data.abstract
          });
          this.onTransferClick("retrievedAbstractSplit", res.data.abstract);
        })
        .catch(err => {
          this.setState({
            abstractLoading: false,
            hyperlinkLoading: false,
            abstract: "Abstract could not be found"
          });
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { doiError } = this.state;
    let text;
    let hyperlink;
    let abstract;
    let manualAbstract;
    let retrievedAbstract;

    if (!isEmpty(this.state.manualAbstractSplit)) {
      manualAbstract = this.state.manualAbstractSplit.map((item, key) => {
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
    }

    if (this.state.hyperlinkLoading) {
      hyperlink = <LinearProgress />;
    } else if (!isEmpty(this.state.hyperlink)) {
      hyperlink = <Typography>{this.state.hyperlink}</Typography>;
    } else {
      hyperlink = <Typography>No link retrieved yet</Typography>;
    }

    if (this.state.abstractLoading) {
      abstract = <LinearProgress />;
    } else if (!isEmpty(this.state.retrievedAbstractSplit)) {
      if (!isEmpty(this.state.retrievedAbstractSplit)) {
        retrievedAbstract = this.state.retrievedAbstractSplit.map(
          (item, key) => {
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
          }
        );
        console.log(retrievedAbstract);
      }
      abstract = <Typography>{retrievedAbstract}</Typography>;
    } else {
      abstract = <Typography>No abstract retrieved yet</Typography>;
    }

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
                  this.onTransferClick("manualAbstractSplit", text);
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
              <Typography>{manualAbstract}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <div className={classes.doicontrols}>
                <div className={classes.doifield}>
                  <TextField
                    name="doi"
                    label="DOI"
                    value={this.state.doi}
                    onChange={this.onChange.bind(this)}
                    error={!isEmpty(doiError)}
                    helperText={doiError}
                    fullWidth
                  />
                </div>
                <div className={classes.doibuttons}>
                  <Button
                    className={classes.btnInline}
                    onClick={() => {
                      this.retrieveLink();
                    }}
                    color="primary"
                    variant="contained"
                  >
                    Retrieve Link
                  </Button>
                  <Button
                    className={classes.btnInline}
                    onClick={() => {
                      this.retrieveAbstract();
                    }}
                    color="primary"
                    variant="contained"
                  >
                    Retrieve Abstract
                  </Button>
                </div>
              </div>

              <Divider className={classes.divider} />
              <Typography variant="headline" gutterBottom>
                Hyperlink to Website
              </Typography>
              {hyperlink}
              <Divider className={classes.divider} />
              <Typography variant="headline" gutterBottom>
                Abstract
              </Typography>
              {abstract}
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
