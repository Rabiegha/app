import React, {createContext, useContext, useState, useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';

const EventContext = createContext();

// Initialize MMKV storage
const storage = new MMKV();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({children}) => {
  const [eventDetails, setEventDetails] = useState({
    secretCode: '',
    eventId: '',
  });
  const [statsAvenir, setStatsAvenir] = useState({
    totale: '',
  });
  const [statsPassees, setStatsPassees] = useState({
    totale: '',
  });

  // Initialisation de l'état de connexion avec false
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      totalePassees: newTotalePassees, // Correction de l'assignation
    });
    console.log('newTotalePassees', newTotalePassees);
  };

  // Fonction pour mettre à jour l'état de connexion
  const login = status => {
    setIsLoggedIn(status);
    // Stocker également l'état dans MMKV
    storage.set('login_status', status.toString());
  };

  const [refreshList, setRefreshList] = useState(false);
  const triggerListRefresh = () => {
    setRefreshList(prev => !prev); // Toggle to force refresh
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
      }}>
      {children}
    </EventContext.Provider>
  );
};
