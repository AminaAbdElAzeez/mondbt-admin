const actions: IAuthActionsConstants = {
  LOGOUT: "LOGOUT",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  EXPIRE_TOKEN: "EXPIRE_TOKEN",
  NOT_EXPIRE_TOKEN: "NOT_EXPIRE_TOKEN",

  login: (token: string, data: any) => ({
    type: actions.LOGIN_SUCCESS,
    payload: { token, data },
  }),

  setTokenAsExpired: () => ({
    type: actions.EXPIRE_TOKEN,
  }),
  setTokenAsNotExpired: () => ({
    type: actions.NOT_EXPIRE_TOKEN,
  }),
  logout: (to: string = "/login") => ({
    type: actions.LOGOUT,
    payload: { to },
  }),
};

export default actions;
