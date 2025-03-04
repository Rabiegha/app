import {createAsyncThunk} from '@reduxjs/toolkit';
import {fetchEventList} from '../../../services/eventsListService';
import {demoEvents} from '../../../demo/demoEvents';

export const fetchFutureEvents = createAsyncThunk(
  'fetchFutureEvents',
  async ({userId, isEventFromList, isDemoMode}, {rejectWithValue}) => {
    const controller = new AbortController(); // 🚀 Crée un contrôleur pour annuler les requêtes
    const timeout = setTimeout(() => {
      controller.abort(); // ⏳ Annule toutes les requêtes après 10s
      rejectWithValue('Fetch events timeout exceeded');
    }, 10000);

    try {
      if (isDemoMode) {
        clearTimeout(timeout); // ✅ Annule le timeout si mode démo
        return {events: demoEvents, timeStamp: Date.now()};
      } else {
        const combinedEvents = [];
        let failedCount = 0; // Compte le nombre d'échecs

        for (const isEventFrom of isEventFromList) {
          try {
            const response = await fetchEventList(userId, isEventFrom, {
              signal: controller.signal, // 🔥 Attache le signal d'annulation
            });

            if (response.status && response.event_details) {
              combinedEvents.push(...response.event_details);
            } else {
              failedCount++;
            }
          } catch (innerError) {
            if (innerError.name === 'AbortError') {
              return rejectWithValue('Request was cancelled due to timeout');
            }
            console.warn(`Skipping isEventFrom=${isEventFrom}`, innerError);
            failedCount++;
          }
        }

        clearTimeout(timeout); // ✅ Annule le timeout après exécution réussie

        if (failedCount === isEventFromList.length) {
          return rejectWithValue('Failed to fetch any events');
        }

        return {events: combinedEvents, timeStamp: Date.now()};
      }
    } catch (error) {
      clearTimeout(timeout);
      return rejectWithValue(error.message || 'Failed to fetch future events');
    }
  }
);
