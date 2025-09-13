import axios from "axios";
import { store } from "store/store";
import authAction from "store/auth/actions";
import { useSelector } from "react-redux";

const { setTokenAsExpired } = authAction;

// import { store } from "../../redux/store";
export const URL = "https://ajjil.appssquare.com/mondbt/public"; // ==> dev
const { idToken } = store.getState().Auth;
// console.log(store.getState())
//const { idToken } =  useSelector((state) => state.Auth);

const instance = axios.create({
  baseURL: `${URL}/api`,
  // headers: {
  //   Authorization: `Bearer ${idToken}`,
  //   // "X-Language": store.getState()?.LanguageSwitcher?.language?.locale ?? "en",
  // },
});

instance.interceptors.request.use((req) => {
  return req;
});
// instance.interceptors.request.use((req) => {
//   const { idToken } = store.getState().Auth; // Get the latest token before every request
//   req.headers.Authorization = `Bearer ${idToken}`;
//   return req;
// });
// axios.interceptors.request.use((config) => {
//   config.headers['Accept-Language'] = locale;
//   return config;
// });
instance.interceptors.request.use((req) => {
  const { idToken } = store.getState().Auth;
  if (idToken) {
    req.headers.Authorization = `Bearer ${idToken}`;
  }
  return req;
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err.response.config, err.response);
    if (err?.response) {
      if (
        err &&
        err.response &&
        err.response.status === 403 &&
        err.response.config.url !== "login"
      ) {
        // window.localStorage.removeItem("mitcvAdminToken");
        // window.location.replace("/");
      } else if (
        err.response.status === 401 &&
        err.response.config.url !== "login"
      ) {
        if (store.getState().Auth.status !== "EXPIRED") {
          store.dispatch(setTokenAsExpired());
        }
        // window.localStorage.removeItem("mitcvAdminToken");
        // window.location.replace("/");
      }

      const customError = {
        ...err,
        message: err.response.data?.message || "An error occurred",
        status: err.response.status,
      };

      return Promise.reject(customError);
    }
    return Promise.reject(err);
  }
);

export default instance;
