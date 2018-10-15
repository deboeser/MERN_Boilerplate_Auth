import React, { Component } from "react";
import isEmpty from "../../validation/is-empty";

import Typography from "@material-ui/core/Typography";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    let keyText = !isEmpty(this.props.match.params.key)
      ? this.props.match.params.key
      : "";

    return (
      <div>
        <Typography variant="display1" gutterBottom>
          Dashboard
        </Typography>
        <Typography gutterBottom>{keyText}</Typography>
      </div>
    );
  }
}

export default Dashboard;
