const ticketsActions = {
    FETCH_TICKETS_DATA: 'FETCH_TICKETS_DATA',
    FETCH_TICKETS_FAIL: 'FETCH_TICKETS_FAIL',
    FETCH_TICKETS_REQUEST: 'FETCH_TICKETS_REQUEST',
    
    fetchTicketsData: (tickets: any[]) => ({
      type: ticketsActions.FETCH_TICKETS_DATA,
       payload: tickets
    }),
    fetchTicketsRequest : () => ({ type: ticketsActions.FETCH_TICKETS_REQUEST }),
    fetchTicketsFailure : (error: string) => ({
      type: ticketsActions.FETCH_TICKETS_FAIL,
      payload: error,
    })
  };
  
  export default ticketsActions;
  