import { useEvent } from '../../context/EventContext';

export const useSessionSelector = () => {
  const { updateSessionDetails } = useEvent();

  return (session) => {
    const {
      ems_secret_code,
      event_id,
      event_name,
      nice_start_datetime,
    } = session;

    updateSessionDetails({
      newSecretCode: ems_secret_code,
      newEventId: event_id,
      newEventName: event_name,
      newNiceStartDate: nice_start_datetime,
    });

    if (__DEV__) {
      console.log('Session selected:', event_name);
    }
  };
};
