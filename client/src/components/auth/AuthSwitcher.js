import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import { connect } from "react-redux";
import SwipeableViews from "react-swipeable-views";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import isEmpty from "../../validation/is-empty";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1
  },
  appbar: {
    backgroundColor: "#FFF",
    boxShadow: "none",
    borderBottom: "1px solid #ddd"
  }
});

class AuthSwitcher extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      // this.Swiper.updateHeight();
    }
  }

  recomputeHeight = () => {
    if (!isEmpty(this.refs.swiper)) {
      this.refs.swiper.updateHeight();
    }
  };

  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar} position="static" color="primary">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          // ref={node => (this.Swiper = node)}
          ref="swiper"
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
          animateHeight
        >
          <TabContainer dir={theme.direction}>
            <LoginForm recomputeHeight={this.recomputeHeight} />
          </TabContainer>
          <TabContainer dir={theme.direction}>
            <RegisterForm recomputeHeight={this.recomputeHeight} />
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

AuthSwitcher.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  )
)(AuthSwitcher);
