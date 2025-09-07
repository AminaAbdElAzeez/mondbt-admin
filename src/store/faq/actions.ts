const faqsActions = {
  FETCH_FAQS_DATA: "FETCH_FAQS_DATA",

  fetchFaqsData: (faqs: any[]) => ({
    type: faqsActions.FETCH_FAQS_DATA,
    payload: faqs,
  }),
};

export default faqsActions;
