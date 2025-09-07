import faqsActions from "./actions";

const initialstate = {
  faqs: null,
};
export default function faqsReducer(state = initialstate, action) {
  switch (action.type) {
    case faqsActions.FETCH_FAQS_DATA:
      return {
        ...state,
        faqs: action.payload,
      };

    default:
      return state;
  }
}
