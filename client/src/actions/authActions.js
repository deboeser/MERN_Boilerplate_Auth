import axios from "axios";
import { GET_ERRORS, SET_AUTH_LOADING } from "./types";

const setLoading = () => dispatch => {
  dispatch({ type: SET_AUTH_LOADING });
};

const registerUser = userData => dispatch => {
  setLoading();
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

export { registerUser, setLoading };
