import {
  SET_TAGS,
  SET_TAGS_LOADING,
  UNSET_TAGS_LOADING
} from "../actions/types";

const initialState = {
  loading: false,
  tags: [],
  tag: {}
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TAGS:
      return {
        ...state,
        loading: false,
        tags: action.payload
      };
    case SET_TAGS_LOADING:
      return {
        ...state,
        loading: true
      };
    case UNSET_TAGS_LOADING:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
};

export default errorReducer;
