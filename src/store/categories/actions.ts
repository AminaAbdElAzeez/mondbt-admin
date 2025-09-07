// actions/userActions.ts
export const FETCH_CATEGORIES_REQUEST = 'FETCATEGORIES_REQUEST';
export const FETCH_CATEGORIES_SUCCESS = 'FETCATEGORIES_SUCCESS';

export const FETCH_CATEGORIES_FAILURE = 'FETCATEGORIES_FAILURE';


export const fetchCategoriesRequest = () => ({ type: FETCH_CATEGORIES_REQUEST });

export const fetchCategoriesSuccess = (categories: any[]) => ({
  type: FETCH_CATEGORIES_SUCCESS,
  payload: categories,
});



export const fetchCategoriesFailure = (error: string) => ({
  type: FETCH_CATEGORIES_FAILURE,
  payload: error,
});


