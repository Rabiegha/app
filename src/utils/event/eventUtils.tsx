import {parse} from 'date-fns';

export function parseDateString(dateString) {
  return parse(dateString, 'dd/MM/yyyy hh:mm a', new Date());
}

export function filterEvents(events, searchQuery) {
  return events.filter(event =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
}

export function splitEventsByDate(events) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventsToday = [];
  const futureEvents = [];

  for (const event of events) {
    const eventDate = parseDateString(event.nice_start_datetime);
    if (isNaN(eventDate)) {
      console.warn('Invalid event date:', event.nice_start_datetime);
      continue;
    }

    if (eventDate.toDateString() === today.toDateString()) {
      eventsToday.push(event);
    } else if (eventDate > today) {
      futureEvents.push(event);
    }
  }

  return {eventsToday, futureEvents};
}
