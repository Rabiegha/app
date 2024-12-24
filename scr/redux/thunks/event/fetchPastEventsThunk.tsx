import { createAsyncThunk } from "@reduxjs/toolkit";
import {demoEvents} from '../../../demo/demoEvents';
import { fetchEventDetails } from "../../../services/eventsListService";

export const fetchPastEvents = createAsyncThunk( 'fetchPastEvents', async (isDemoMode) => {
    if (isDemoMode) {
        return {events: demoEvents, timeStamp: Date.now()}
    } else   {
        const response = await fetchEventDetails(userId, isEventFrom)
    }
    try {
    }
} )