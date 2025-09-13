type tokenStatus = "EXPIRED" |"NOT_EXPIRED" |"NOT_LOGGED"
interface IUserData {
  name: string;
  civil_number: string;
  role: number;
  email: string;
  phone: string;
}

    interface IAuth {
  status: TokenStatus;
  token: string | null;
  data: IUserData | null;
   role: number | null; 

  to?: string;
}

    type LOGIN_SUCCESS = "LOGIN_SUCCESS";
type EXPIRE_TOKEN = "EXPIRE_TOKEN";
type NOT_EXPIRE_TOKEN = "NOT_EXPIRE_TOKEN";
type LOGOUT = "LOGOUT";

    interface IAuthAction {
  type: LOGIN_SUCCESS | EXPIRE_TOKEN | LOGOUT | NOT_EXPIRE_TOKEN;
  payload?: {
    token?: string;
    data?: IUserData;
    to?: string;
  };
}

   interface IAuthActionsConstants {
  LOGOUT: LOGOUT;
  LOGIN_SUCCESS: LOGIN_SUCCESS;
  EXPIRE_TOKEN: EXPIRE_TOKEN;
  NOT_EXPIRE_TOKEN: NOT_EXPIRE_TOKEN;

  login: (token: string, data: IUserData) => {
    type: LOGIN_SUCCESS;
    payload: {
      token: string;
      data: IUserData;
    };
  };

  setTokenAsExpired: () => {
    type: EXPIRE_TOKEN;
  };

  setTokenAsNotExpired: () => {
    type: NOT_EXPIRE_TOKEN;
  };

  logout: (to?: string) => {
    type: LOGOUT;
    payload: {
      to: string;
    };
  };
}
