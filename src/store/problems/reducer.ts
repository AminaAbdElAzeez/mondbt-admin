import problemsActions from "./actions";

const initialstate = {
  problems:null,
};
export default function problemssReducer(state = initialstate, action) {
  switch (action.type) {
    case problemsActions.FETCH_PROBLEMS_DATA:
      return {
        ...state,
        problems: action.payload,
      };
   
    default:
      return state;
  }
}
