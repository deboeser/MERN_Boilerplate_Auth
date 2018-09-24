import axios from "axios";
import { GET_ERRORS, SET_AUTH_LOADING } from "./types";

const registerUser = userData => dispatch => {
  dispatch({ type: SET_AUTH_LOADING });
  axios
    .post("/api/auth/register", userData)
    .then(res => console.log("TODO: Success Registration Successful"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export { registerUser };
