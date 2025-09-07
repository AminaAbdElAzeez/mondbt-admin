import ticketsActions from "./actions";

const initialstate = {
  tickets:null,
  loading:false,
  error:null
};
export default function ticketsReducer(state = initialstate, action:any) {
  switch (action.type) {
    case ticketsActions.FETCH_TICKETS_REQUEST:
      return { ...state, loading: true, error: null };
    case ticketsActions.FETCH_TICKETS_DATA:
      return {
        ...state,
        tickets: action.payload,
        loading: false
      };
        case ticketsActions.FETCH_TICKETS_FAIL:
        return { ...state, loading: false, error: action.payload };
   
    default:
      return state;
  }
}
