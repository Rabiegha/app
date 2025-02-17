import {useMemo} from 'react';
import {filterEvents, splitEventsByDate} from '../../utils/event/eventUtils';

export default function useFilteredAndSectionedEvents(events, searchQuery) {
  const filteredEvents = useMemo(() => {
    return events ? filterEvents(events, searchQuery) : [];
  }, [events, searchQuery]);

  const {eventsToday, futureEvents} = useMemo(() => {
    return splitEventsByDate(filteredEvents);
  }, [filteredEvents]);

  const sections = useMemo(() => {
    const s = [];
    if (eventsToday.length > 0) {
      s.push({title: "Aujourd'hui", data: eventsToday, isFutureSection: false});
    }
    if (futureEvents.length > 0) {
      s.push({title: '', data: futureEvents, isFutureSection: true});
    }
    return s;
  }, [eventsToday, futureEvents]);

  return {sections, eventsToday, futureEvents};
}
