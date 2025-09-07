// const problemsActions = {
//     FETCH_PROBLEMS_DATA : "FETCH_PROBLEMS_DATA",
//     fetchProblemsData : (problems: any[])=>({
//       type: problemsActions.FETCH_PROBLEMS_DATA,
//       payload: problems
//     })
// }
// export default problemsActions


const problemsActions = {
  FETCH_PROBLEMS_DATA: "FETCH_PROBLEMS_DATA",

  fetchProblemsData: (problems: any[]) => ({
    type: problemsActions.FETCH_PROBLEMS_DATA,
    payload: problems,
  }),
};

export default problemsActions;
