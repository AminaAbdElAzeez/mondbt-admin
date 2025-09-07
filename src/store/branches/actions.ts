// actions/userActions.ts
export const FETCH_BRANCHES_REQUEST = 'FETCH_BRANCHES_REQUEST';
export const FETCH_BRANCHES_SUCCESS = 'FETCH_BRANCHES_SUCCESS';
export const FETCH_TECH_USERS = 'FETCH_TECH_USERS'
export const FETCH_BRANCHES_FAILURE = 'FETCH_BRANCHES_FAILURE';
export const REMOVE_USER = 'REMOVE_USER';
export const FETCH_TECH_BRANCHES = 'FETCH_TECH_BRANCHES';
export const SEARCH_VAL_CHANGED = 'SEARCH_VAL_CHANGED'

export const fetchBranchesRequest = () => ({ type: FETCH_BRANCHES_REQUEST });

export const fetchBranchesSuccess = (branches: any[]) => ({
  type: FETCH_BRANCHES_SUCCESS,
  payload: branches,
});
export const fetchBranchLatLng = (latLng: any) => ({
  type: "FETCH_BRANCH_LATLNG",
  payload: latLng,
});
export const searchValueChangeAction = (dataIndex: any[]) => ({
  type: SEARCH_VAL_CHANGED,
  payload: dataIndex,
});

export const fetchBranchesFailure = (error: string) => ({
  type: FETCH_BRANCHES_FAILURE,
  payload: error,
});
// export const fetchTechContainersSuccess = (techBranches: any[]) => ({
//   type: FETCH_TECH_BRANCHES,
//   payload: techBranches,
// });
// export const fetchTechUsersSuccess = (tech: any[]) => ({
//   type: FETCH_TECH_USERS,
//   payload: tech,
// });

