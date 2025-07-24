import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {MMKV} from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types/session';

interface EventContextType {
  secretCode: string;
  eventId: string;
  eventName: string;
  niceStartDate: string;
  eventLogo: string;
  sessionDetails: SessionDetails | null;
  updateEventDetails: (params: {
    newSecretCode: string;
    newEventId: string;
    newEventName: string;
    newNiceStartDate: string;
    newEventLogo?: string;
  }) => void;
  updateSessionDetails: (params: {
    newSecretCode: string;
    newEventId: string;
    newEventName: string;
    newNiceStartDate: string;
  }) => void;
  clearSessionDetails: () => void;
  triggerListRefresh: () => void;
  isLoggedIn: boolean;
  login: (status: boolean) => void;
  updateStatsPassees: (params: { newTotalePassees: string }) => void;
  setStatsAvenir: React.Dispatch<React.SetStateAction<{ totaleAvenir: string }>>;
  updateStatsAvenir: (params: { newTotaleAvenir: string }) => void;
  setStatsPassees: React.Dispatch<React.SetStateAction<{ totalePassees: string }>>;
  updateAttendee: (eventId: string, updatedAttendee: any) => Promise<void>;
  addAttendee: (eventId: string, newAttendee: any) => Promise<void>;
  attendeesRefreshKey: number;
}

interface SessionDetails {
  secretCode: string;
  eventId: string;
  eventName: string;
  niceStartDate: string;
}

interface EventProviderProps {
  children: ReactNode;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Initialize MMKV storage
const storage = new MMKV();

export const useEvent = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({children}: EventProviderProps) => {
  // Event Details
  const [eventDetails, setEventDetails] = useState<{
    secretCode: string;
    eventId: string;
    eventName: string;
    niceStartDate: string;
    eventLogo: string;
  }>({
    secretCode: '',
    eventId: '',
    eventName: '',
    niceStartDate: '',
    eventLogo: '',
  });
  //Session details
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  // Event Stats
  const [statsAvenir, setStatsAvenir] = useState({
    totaleAvenir: '',
  });
  const [statsPassees, setStatsPassees] = useState({
    totalePassees: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [attendeesRefreshKey, setAttendeesRefreshKey] = useState(0);

  useEffect(() => {
    // AUth get auth status from MMKV
    const storedStatus = storage.getBoolean('login_status');
    setIsLoggedIn(storedStatus || false);

    // Event Get last seelected event from MMKV
    const storedEvent = storage.getString('eventDetails');
    if (storedEvent) {
      const parsed = JSON.parse(storedEvent);
      setEventDetails(parsed);
    }
  }, []);

  const updateEventDetails = ({
    newSecretCode,
    newEventId,
    newEventName,
    newNiceStartDate,
    newEventLogo
  }: {
    newSecretCode: string;
    newEventId: string;
    newEventName: string;
    newNiceStartDate: string;
    newEventLogo?: string;
  }) => {

    const eventData = {
      secretCode: newSecretCode,
      eventId: newEventId,
      eventName: newEventName,
      niceStartDate: newNiceStartDate,
      eventLogo: newEventLogo || '',
    };
    setEventDetails(eventData);
    storage.set('eventDetails', JSON.stringify(eventData));

  };

  const updateSessionDetails = ({
    newSecretCode,
    newEventId,
    newEventName,
    newNiceStartDate
  }: {
    newSecretCode: string;
    newEventId: string;
    newEventName: string;
    newNiceStartDate: string;
  }) => {
    const sessionData = {
      secretCode: newSecretCode,
      eventId: newEventId,
      eventName: newEventName,
      niceStartDate: newNiceStartDate,
    };
    setSessionDetails(sessionData);
    console.log('Session details updated:', sessionData);
  };


  const clearSessionDetails = () => {
    setSessionDetails(null);
  };



  const updateStatsAvenir = ({newTotaleAvenir}: { newTotaleAvenir: string }) => {
    setStatsAvenir({
      totaleAvenir: newTotaleAvenir,
    });
    console.log('newTotaleAvenir', newTotaleAvenir);
  };

  const updateStatsPassees = ({newTotalePassees}: { newTotalePassees: string }) => {
    setStatsPassees({
      totalePassees: newTotalePassees,
    });
    console.log('newTotalePassees', newTotalePassees);
  };

  const login = (status: boolean) => {
    setIsLoggedIn(status);
    storage.set('login_status', status);
  };

  const triggerListRefresh = () => {
    setAttendeesRefreshKey(prevKey => prevKey + 1);
    /* console.log('List refresh triggered, new attendeesRefreshKey:', attendeesRefreshKey + 1); */
  };

  const updateAttendee = async (eventId: string, updatedAttendee: any) => {
    console.log('Updating attendee locally:', updatedAttendee);
    const key = `attendees_${eventId}`;
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      let parsedData = JSON.parse(value);
      if (!Array.isArray(parsedData)) {
        parsedData = [];
      }
      const updatedData = parsedData.map((attendee: any) =>
        attendee.id == updatedAttendee.id ? updatedAttendee : attendee,
      );
      await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      console.log('Local attendee updated, triggering list refresh');
      triggerListRefresh();
    }
  };

  const addAttendee = async (eventId: string, newAttendee: any) => {
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

        sessionDetails,
        updateSessionDetails,
        clearSessionDetails,
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
