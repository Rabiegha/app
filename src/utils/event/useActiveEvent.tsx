import { useEvent } from '../../context/EventContext';

export const useActiveEvent = () => {
  const { sessionDetails, ...mainEvent } = useEvent();
  return sessionDetails || mainEvent;
};
