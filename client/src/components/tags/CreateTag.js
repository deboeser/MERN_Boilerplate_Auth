import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";

import ChipInput from "material-ui-chip-input";

import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";

import ColorSelector from "../tags/ColorSelector";
import standardTagConfiguration from "../common/standardTagConfiguration";
import isEmpty from "../../validation/is-empty";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  input: {
    marginBottom: theme.spacing.unit * 2
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  ...standardTagConfiguration(theme)
});

class CreateTag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      color: "",
      background: "",
      underlined: false,
      bold: false,
      bigger: false,
      tagname: "",
      phrases: [],
      errors: {}
    };

    if (!isEmpty(props.tag)) {
      this.state = {
        ...this.state,
        id: props.tag._id,
        color: props.tag.color,
        background: props.tag.background,
        underlined: props.tag.underlined,
        bold: props.tag.bold,
        bigger: props.tag.bigger,
        tagname: props.tag.tagname,
        phrases: props.tag.phrases
      };
    }
  }

  componentDidMount() {
    this.props.exportSelf(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = (field, val) => {
    this.setState({ [field]: val });
  };

  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleAddChip = e => {
    let arr = this.state.phrases;
    arr.push(e);
    this.setState({ phrases: arr });
  };

  handleDeleteChip = (e, i) => {
    let arr = this.state.phrases;
    arr.splice(i, 1);
    this.setState({ phrases: arr });
  };

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    let placeholder;

    const textHightlightClasses = classNames(
      classes[this.state.background + "Light"],
      classes[this.state.color],
      this.state.underlined && classes.textUnderlined,
      this.state.bold && classes.textBold,
      this.state.bigger && classes.textBigger
    );

    if (this.state.phrases.length > 0) {
      placeholder = { placeholder: "+ Add Tag" };
    }

    return (
      <div className={classes.root}>
        <TextField
          name="tagname"
          className={classes.input}
          onChange={this.onTextChange}
          label="Color Tag Name"
          error={!isEmpty(errors.tagname)}
          helperText={errors.tagname}
          value={this.state.tagname}
          fullWidth
        />
        <ChipInput
          fullWidth
          className={classes.input}
          newChipKeyCodes={[13, 188]}
          label="Phrases to highlight"
          value={this.state.phrases}
          onAdd={chip => this.handleAddChip(chip)}
          onDelete={(chip, index) => this.handleDeleteChip(chip, index)}
          InputProps={{ ...placeholder, error: !isEmpty(errors.phrases) }}
          helperText={errors.phrases}
          FormHelperTextProps={{ error: !isEmpty(errors.phrases) }}
          InputLabelProps={{ error: !isEmpty(errors.phrases) }}
        />
        <Divider className={classes.divider} />
        <Typography variant="subheading" gutterBottom>
          Text Color
        </Typography>
        <ColorSelector
          name="color"
          value={this.state.color}
          onChange={this.onChange}
          dark
        />
        <Divider className={classes.divider} />
        <Typography variant="subheading" gutterBottom>
          Background Color
        </Typography>
        <ColorSelector
          name="background"
          value={this.state.background}
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

        <Typography>
          Lorem ipsum dolor sit amet, consectetur{" "}
          <span className={textHightlightClasses}>adipiscing elit</span>.
          Integer venenatis mi nec enim aliquet dignissim. Donec rutrum vel est
          non placerat. Quisque at vehicula leo. Morbi sed lacus mattis sapien
          tempus <span className={textHightlightClasses}>finibus faucibus</span>{" "}
          sit amet neque. Integer non quam id turpis molestie egestas. Sed
          sodales vel quam et interdum. Aliquam tincidunt diam id justo maximus
          finibus.
        </Typography>
      </div>
    );
  }
}

CreateTag.propTypes = {
  tag: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  exportSelf: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tag: state.tags.tag,
  errors: state.errors
});

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    null
  )
)(CreateTag);
