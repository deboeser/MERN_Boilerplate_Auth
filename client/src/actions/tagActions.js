import axios from "axios";
import {
  GET_ERRORS,
  SET_TAG,
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

const setTag = tagData => dispatch => {
  dispatch({
    type: SET_TAG,
    payload: tagData
  });
};

const addTag = (tagData, callback) => dispatch => {
  axios
    .post("/api/colortag/", tagData)
    .then(res => {
      callback();
      loadUserTags();
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

const deleteTag = (tagId, callback) => dispatch => {
  axios
    .delete(`/api/colortag/id/${tagId}`)
    .then(res => {
      callback();
    })
    .catch(err => console.log(err.response.data));
};

export { loadUserTags, addTag, deleteTag, setTag };
