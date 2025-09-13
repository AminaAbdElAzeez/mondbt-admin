import { combineReducers } from "redux";
import App from "store/app/reducer";
import Auth from "store/auth/reducer";
import Profile from "store/profile/reducer";

export default combineReducers({
  Auth,
  App,
  Profile,
});
