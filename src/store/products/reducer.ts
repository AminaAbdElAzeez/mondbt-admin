import {
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  TOGGLE_FEATURED_PRODUCT,
} from "./actions";

const initialState = {
  loading: false,
  products: [],
  error: null,
};

const productsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, products: action.payload };
    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case TOGGLE_FEATURED_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? { ...product, is_featured: action.payload.isFeatured }
            : product
        ),
      };
    default:
      return state;
  }
};

export default productsReducer;
