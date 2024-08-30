import React, {createContext, useContext, useState, useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventContext = createContext();

// Initialize MMKV storage
const storage = new MMKV();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({children}) => {
  const [eventDetails, setEventDetails] = useState({
    secretCode: '',
    eventId: '',
    eventName: '',
  });
  const [statsAvenir, setStatsAvenir] = useState({
    totaleAvenir: '',
  });
  const [statsPassees, setStatsPassees] = useState({
    totalePassees: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [attendeesRefreshKey, setAttendeesRefreshKey] = useState(0);

  useEffect(() => {
    const storedStatus = storage.getBoolean('login_status');
    setIsLoggedIn(storedStatus);
  }, []);

  const updateEventDetails = ({newSecretCode, newEventId, newEventName}) => {
    setEventDetails({
      secretCode: newSecretCode,
      eventId: newEventId,
      eventName: newEventName,
    });
    console.log('Event details updated:', {
      secretCode: newSecretCode,
      eventId: newEventId,
      eventName: newEventName,
    });
  };

  const updateStatsAvenir = ({newTotaleAvenir}) => {
    setStatsAvenir({
      totaleAvenir: newTotaleAvenir,
    });
    console.log('newTotaleAvenir', newTotaleAvenir);
  };

  const updateStatsPassees = ({newTotalePassees}) => {
    setStatsPassees({
      totalePassees: newTotalePassees,
    });
    console.log('newTotalePassees', newTotalePassees);
  };

  const login = status => {
    setIsLoggedIn(status);
    storage.set('login_status', status.toString());
  };

  const triggerListRefresh = () => {
    setAttendeesRefreshKey(prevKey => prevKey + 1);
    /*     console.log('List refresh triggered, new attendeesRefreshKey:', attendeesRefreshKey + 1); */
  };

  const updateAttendee = async (eventId, updatedAttendee) => {
    console.log('Updating attendee locally:', updatedAttendee);
    const key = `attendees_${eventId}`;
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      let parsedData = JSON.parse(value);
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }
      const updatedData = parsedData.map(attendee =>
        attendee.id == updatedAttendee.id ? updatedAttendee : attendee,
      );
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      console.log('Local attendee updated, triggering list refresh');
      triggerListRefresh();
    }
  };

  const addAttendee = async (eventId, newAttendee) => {
    console.log('Adding new attendee locally:', newAttendee);
    const key = `attendees_${eventId}`;
    const value = await AsyncStorage.getItem(key);
    let parsedData = [];
    if (value !== null) {
      parsedData = JSON.parse(value);
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }
    }
    parsedData.push(newAttendee);
    await AsyncStorage.setItem(key, JSON.stringify(parsedData));
    console.log('New attendee added locally, triggering list refresh');
    triggerListRefresh();
  };

  return (
    <EventContext.Provider
      value={{
        ...eventDetails,
        updateEventDetails,
        refreshList,
        triggerListRefresh,
        isLoggedIn,
        login,
        updateStatsPassees,
        setStatsAvenir,
        updateStatsAvenir,
        setStatsPassees,
        updateAttendee,
        addAttendee,
        attendeesRefreshKey,
      }}>
      {children}
    </EventContext.Provider>
  );
};
