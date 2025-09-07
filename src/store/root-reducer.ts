import { combineReducers } from "redux";
import App from "store/app/reducer";
import Auth from "store/auth/reducer";
import Users from "store/users/reducer";
import LanguageSwitcher from "store/languageSwitcher/reducer";
import ThemeSwitcher from "store/themeSwitcher/reducer";
import crumbReducer from "store/crumb/reducer";
import modal from "store/modal/reducer";
import Profile from "store/profile/reducer";
import Branches from "store/branches/reducer";
import Categories from "store/categories/reducer";
import Tickets from "store/tickets/reducer";
import Faqs from "store/faq/reducer";
import Problems from "store/problems/reducer";
import Products from "store/products/reducer";
import { EditProfile } from "./editprofile/reducer";
import MapReducer from "store/map/reducer";

export default combineReducers({
  Auth,
  App,
  Branches,
  Categories,
  Products,
  MapReducer,
  Users,
  LanguageSwitcher,
  modal,
  Profile,
  EditProfile,
  crumbReducer,
  ThemeSwitcher,
  Tickets,
  Faqs,
  Problems,
});
