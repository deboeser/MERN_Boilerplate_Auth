import { GET_ERRORS, SET_AUTH_LOADING } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTH_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ERRORS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
