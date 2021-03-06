import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import jwt_decode from "jwt-decode";
import { createMuiTheme } from "@material-ui/core/styles";

import blue from "@material-ui/core/colors/blue";

import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";


import "./App.css";

// Check for token availablity
if (localStorage.jwtToken) {
  // set auth token header
  setAuthToken(localStorage.jwtToken);
  // Decode and get user info, get expiration, set user
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  //Check of expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
  }
}

// A custom-defined color must have a 500 property
const random = {
  500: "#6A65F1"
};

const theme = createMuiTheme({
  palette: {
    primary: random,
    secondary: blue
  }
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <div className="App" id="app">
            </div>
          </Router>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;
