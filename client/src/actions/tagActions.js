import axios from "axios";
import {
  GET_ERRORS,
  SET_TAGS,
  SET_TAGS_LOADING,
  UNSET_TAGS_LOADING
} from "./types";

const setLoading = () => {
  return { type: SET_TAGS_LOADING };
};

const unsetLoading = () => {
  return { type: UNSET_TAGS_LOADING };
};

const loadUserTags = () => dispatch => {
  dispatch(setLoading());
  axios
    .get("/api/colortag/current/")
    .then(res => {
      dispatch({
        type: SET_TAGS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export { loadUserTags };
