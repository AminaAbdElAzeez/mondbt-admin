// reducers/userReducer.ts
import { latLng } from "leaflet";
import {
  FETCH_BRANCHES_REQUEST,
  FETCH_BRANCHES_SUCCESS,
  FETCH_BRANCHES_FAILURE,
 
  SEARCH_VAL_CHANGED,
} from "./actions";

const initialState = {
  loading: false,
  branches: [],
  error: null,
  
  searchValArr: [],
  mapLatLng: {}
};

const branchesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_BRANCHES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BRANCHES_SUCCESS:
      return { ...state, loading: false, branches: action.payload };
    
   
    case SEARCH_VAL_CHANGED:
      return { ...state, searchValArr: action.payload };
      case "FETCH_BRANCH_LATLNG":
      return { ...state, mapLatLng: action.payload };
    default:
      return state;
  }
};
export default branchesReducer;
