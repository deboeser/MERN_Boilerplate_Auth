import axios from "axios";
import {
  GET_ERRORS,
  SET_TAG,
  SET_TAGS,
  SET_TAGS_LOADING,
  UNSET_TAGS_LOADING
} from "./types";
import isEmpty from "../validation/is-empty";

const setLoading = () => {
  return { type: SET_TAGS_LOADING };
};

// eslint-disable-next-line
const unsetLoading = () => {
  return { type: UNSET_TAGS_LOADING };
};

const loadUserTags = () => dispatch => {
  dispatch(setLoading());
  axios
    .get("/api/colortag/current/")
    .then(res => {
      let appliedTags = res.data.map(tag => {
        let tagClasses = [];
        !isEmpty(tag.color) && tagClasses.push(tag.color);
        !isEmpty(tag.background) && tagClasses.push(tag.background + "Light");
        tag.underlined && tagClasses.push("textUnderlined");
        tag.bold && tagClasses.push("textBold");
        tag.bigger && tagClasses.push("textBigger");
        return {
          phrases: tag.phrases,
          classes: tagClasses
        };
      });
      const payload = {
        tags: res.data,
        appliedTags: appliedTags
      };
      dispatch({
        type: SET_TAGS,
        payload: payload
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
