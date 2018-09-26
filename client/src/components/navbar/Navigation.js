import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

import { triggerSnack } from "../../actions/snackActions";
import NavBar from "./NavBar";
import NavDrawer from "./NavDrawer";
import ColorSelector from "../tags/ColorSelector";
import SnackbarWrapper from "../common/SnackbarWrapper";
import { colorClasses } from "../common/colors";

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    overflowY: "scroll"
  },
  contentBody: {},
  snackbar: {
    zIndex: 1000000
  },
  textUnderlined: {
    textDecorationLine: "underline"
  },
  textBold: {
    fontWeight: "bold"
  },
  ...colorClasses("Light", 100, "backgroundColor"),
  ...colorClasses("", 700, "color")
});

class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colFont: "",
      colBackground: "",
      underlined: false,
      bold: false,
      open: false,
      dialog: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.snack) {
      this.setState({ snack: nextProps.snack });
    }
    if (nextProps.auth) {
      this.setState({ auth: nextProps.auth });
    }
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  openSuccessSnack = newSnack => {
    this.props.triggerSnack(newSnack);
  };

  closeSuccessSnack = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.props.triggerSnack({ type: "", msg: "" });
  };

  onChange = (field, val) => {
    this.setState({ [field]: val });
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const { classes } = this.props;

    const textHightlightClasses = classNames(
      classes[this.state.colBackground + "Light"],
      classes[this.state.colFont],
      this.state.underlined && classes.textUnderlined,
      this.state.bold && classes.textBold
    );

    return (
      <div className={classes.root}>
        <NavBar
          open={this.state.open}
          handleDrawerOpen={this.handleDrawerOpen}
        />
        <NavDrawer
          open={this.state.open}
          handleDrawerClose={this.handleDrawerClose}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.contentBody}>
            <Typography variant="display3" gutterBottom>
              Content
            </Typography>
            <Typography variant="subheading" gutterBottom>
              Text Color
            </Typography>
            <ColorSelector
              name="colFont"
              value={this.state.colFont}
              onChange={this.onChange}
              dark
            />
            <Divider className={classes.divider} />
            <Typography variant="subheading" gutterBottom>
              Background Color
            </Typography>
            <ColorSelector
              name="colBackground"
              value={this.state.colBackground}
              onChange={this.onChange}
              light
            />
            <Divider className={classes.divider} />
            <Typography variant="subheading" gutterBottom>
              Text Decoration
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={this.state.underlined}
                  onChange={this.handleSwitch("underlined")}
                  value="underlined"
                />
              }
              label="Underlined"
            />
            <FormControlLabel
              control={
                <Switch
                  color="primary"
                  checked={this.state.bold}
                  onChange={this.handleSwitch("bold")}
                  value="bold"
                />
              }
              label="Bold"
            />
            <Divider className={classes.divider} />
            <Typography variant="subheading" gutterBottom>
              Highlightning Preview
            </Typography>

            <div>
              Lorem ipsum dolor sit amet, consectetur{" "}
              <span className={textHightlightClasses}>adipiscing elit</span>.
              Integer venenatis mi nec enim aliquet dignissim. Donec rutrum vel
              est non placerat. Quisque at vehicula leo. Morbi sed lacus mattis
              sapien tempus{" "}
              <span className={textHightlightClasses}>finibus faucibus</span>{" "}
              sit amet neque. Integer non quam id turpis molestie egestas. Sed
              sodales vel quam et interdum. Aliquam tincidunt diam id justo
              maximus finibus.
            </div>
            {/* <Button
            onClick={() =>
              this.openSuccessSnack({ type: "success", msg: "YEAH" })
            }
          >
            Open success snackbar
          </Button> */}
          </div>
        </main>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          className={classes.snackbar}
          open={this.props.snack.open}
          autoHideDuration={this.props.snack.duration}
          onClose={this.closeSuccessSnack}
        >
          <SnackbarWrapper
            onClose={this.closeSuccessSnack}
            variant={this.props.snack.type}
            message={this.props.snack.msg}
          />
        </Snackbar>
      </div>
    );
  }
}

Navigation.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  snack: state.snack
});

const mapDispatchToProps = {
  triggerSnack
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Navigation);
