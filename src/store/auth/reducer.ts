import actions from "./actions";
const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
const savedData = typeof window !== "undefined" ? localStorage.getItem("authData") : null;

let parsedData: IUserData | null = null;
try {
  parsedData = savedData ? JSON.parse(savedData) : null;
} catch {
  parsedData = null;
}


const initState: IAuth = {
  token: savedToken,
  data: parsedData,
  role: parsedData?.role ?? null,
  status: savedToken ? "NOT_EXPIRED" : "NOT_LOGGED",
  to: "/login",
};



export default function authReducer(
  state = initState,
  action: IAuthAction
): IAuth {
  switch (action.type) {
   case actions.LOGIN_SUCCESS:
  localStorage.setItem("token", action.payload.token);
  localStorage.setItem("authData", JSON.stringify(action.payload.data));

  return {
    ...state,
    token: action.payload.token,
    data: action.payload.data || null,
    role: action.payload.data?.role ?? null,
    status: "NOT_EXPIRED",
  };


    case actions.LOGOUT:
  localStorage.removeItem("token");
  localStorage.removeItem("authData");

  return {
    token: null,
    data: null,
    status: "NOT_LOGGED",
    role: null, 
    to: action.payload.to,
  };


    case actions.EXPIRE_TOKEN:
      return {
        ...state,
        status: "EXPIRED",
      };

    case actions.NOT_EXPIRE_TOKEN:
      return {
        ...state,
        status: "NOT_EXPIRED",
      };

    default:
      return state;
  }
}
