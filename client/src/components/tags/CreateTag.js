import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";

import { colorClasses } from "../common/colors";
import ColorSelector from "../tags/ColorSelector";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  textUnderlined: {
    textDecorationLine: "underline"
  },
  textBold: {
    fontWeight: "bold"
  },
  textBigger: {
    fontSize: "1.25rem"
  },
  ...colorClasses("Light", 100, "backgroundColor"),
  ...colorClasses("", 700, "color")
});

class CreateTag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      colFont: "",
      colBackground: "",
      underlined: false,
      bold: false,
      bigger: false
    };
  }

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
      this.state.bold && classes.textBold,
      this.state.bigger && classes.textBigger
    );

    return (
      <div className={classes.root}>
        <Typography variant="display2" gutterBottom>
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
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={this.state.bigger}
              onChange={this.handleSwitch("bigger")}
              value="bigger"
            />
          }
          label="Bigger"
        />
        <Divider className={classes.divider} />
        <Typography variant="subheading" gutterBottom>
          Highlightning Preview
        </Typography>

        <div>
          Lorem ipsum dolor sit amet, consectetur{" "}
          <span className={textHightlightClasses}>adipiscing elit</span>.
          Integer venenatis mi nec enim aliquet dignissim. Donec rutrum vel est
          non placerat. Quisque at vehicula leo. Morbi sed lacus mattis sapien
          tempus <span className={textHightlightClasses}>finibus faucibus</span>{" "}
          sit amet neque. Integer non quam id turpis molestie egestas. Sed
          sodales vel quam et interdum. Aliquam tincidunt diam id justo maximus
          finibus.
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CreateTag);
