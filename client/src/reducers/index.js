import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import snackReducer from "./snackReducer";
import tagReducer from "./tagReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  snack: snackReducer,
  tags: tagReducer
});
