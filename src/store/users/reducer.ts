// reducers/userReducer.ts
import {
    FETCH_USERS_REQUEST,
    FETCH_USERS_SUCCESS,
    FETCH_USERS_FAILURE,
    REMOVE_USER,
    FETCH_ROLES_SUCCESS
  } from './actions';
  
  const initialState = {
    loading: false,
    users: [],
    error: null,
    roles:[]
  };
  
   const usersReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case FETCH_USERS_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_USERS_SUCCESS:
        return { ...state, loading: false, users: action.payload };
        case FETCH_ROLES_SUCCESS:
        return { ...state, loading: false, roles: action.payload };
      case FETCH_USERS_FAILURE:
        return { ...state, loading: false, error: action.payload };
        case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
      default:
        return state;
    }
  };
  export default usersReducer;
  