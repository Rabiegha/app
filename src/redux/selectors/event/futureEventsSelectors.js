export const selectFutureEvents = state => state.futureEvents.events;
export const selectFutureEventsLoading = state => state.futureEvents.loading;
export const selectFutureEventsError = state => state.futureEvents.error;
export const selectFutureEventsTimeStamp = state =>
  state.futureEvents.timeStamp;
