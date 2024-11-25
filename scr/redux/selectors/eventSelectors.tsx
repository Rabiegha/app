// src/redux/eventSelectors.js

export const selectEventsState = state => state.events;

export const selectEvents = state => selectEventsState(state).events;

export const selectLoading = state => selectEventsState(state).loading;

export const selectError = state => selectEventsState(state).error;

export const selectTimeStamp = state => selectEventsState(state).timeStamp;
