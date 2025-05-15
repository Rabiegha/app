import {createAsyncThunk} from '@reduxjs/toolkit';
import {demoEvents} from '../../../demo/demoEvents';
import {fetchEventList} from '../../../services/eventsListService';

export const fetchPastEvents = createAsyncThunk(
  'fetchPastEvents',
  async ({userId, isDemoMode}, {rejectWithValue}) => {
    const controller = new AbortController(); // 🚀 Crée un contrôleur pour annuler la requête
    const timeout = setTimeout(() => {
      controller.abort(); // ⏳ Annule la requête après 10s
      rejectWithValue('Fetch past events timeout exceeded');
    }, 10000);

    try {
      if (isDemoMode) {
        clearTimeout(timeout); // ✅ Annule le timeout si mode démo
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        const response = await fetchEventList(userId, 0, {
          signal: controller.signal, // 🔥 Permet d'annuler la requête si timeout
        });

        clearTimeout(timeout); // ✅ Annule le timeout après succès

        return {
          events: response.event_details || [],
          timeStamp: Date.now(),
        };
      }
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        return rejectWithValue('Request was cancelled due to timeout');
      }
      return rejectWithValue(error.message || 'Failed to fetch past events');
    }
  }
);
