// actions/userActions.ts
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const REMOVE_USER = 'REMOVE_USER';

export const fetchUsersRequest = () => ({ type: FETCH_USERS_REQUEST });
export const fetchUsersSuccess = (users: any[]) => ({
  type: FETCH_USERS_SUCCESS,
  payload: users,
});
export const fetchAllRolesSuccess = (roles: any[]) => ({
  type: FETCH_ROLES_SUCCESS,
  payload: roles,
});
export const fetchUsersFailure = (error: string) => ({
  type: FETCH_USERS_FAILURE,
  payload: error,
});

export const removeUserLocally = (userId: string) => ({
  type: REMOVE_USER,
  payload: userId,
});
