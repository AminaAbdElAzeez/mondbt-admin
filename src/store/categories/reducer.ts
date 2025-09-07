
// reducers/userReducer.ts

import {
 FETCH_CATEGORIES_REQUEST,
 FETCH_CATEGORIES_SUCCESS,
 FETCH_CATEGORIES_FAILURE
} from "./actions";

const initialState = {
  loading: false,
  categories: [],
  error: null,
  
  
};

const categoriesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_CATEGORIES_SUCCESS:
      return { ...state, loading: false, categories: action.payload };
    
   
   
    default:
      return state;
  }
};
export default categoriesReducer;
