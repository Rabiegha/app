import { useEvent } from '../../context/EventContext';
import { Session } from '../../types/session';

export const useSessionSelector = () => {
  const { updateSessionDetails } = useEvent();

  return (session: Session) => {
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
