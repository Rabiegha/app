import {parse} from 'date-fns';

import {Event} from '../../types/event.types';

export function parseDateString(dateString: string): Date {
  return parse(dateString, 'dd/MM/yyyy hh:mm a', new Date());
}

// Fonction pour normaliser le texte (supprimer accents et espaces)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim() // Supprimer les espaces en début/fin
    .normalize('NFD') // Décomposer les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les diacritiques (accents)
    .replace(/\s+/g, ' '); // Remplacer plusieurs espaces par un seul
}

export function filterEvents(events: Event[], searchQuery: string): Event[] {
  // Si pas de recherche, retourner tous les événements
  if (!searchQuery || searchQuery.trim() === '') {
    return events;
  }

  const normalizedQuery = normalizeText(searchQuery);
  
  return events.filter((event: Event) => {
    const normalizedEventName = normalizeText(event.event_name);
    
    // Recherche flexible : diviser la requête en mots et vérifier que tous les mots sont présents
    const queryWords = normalizedQuery.split(' ').filter((word: string) => word.length > 0);
    
    return queryWords.every((word: string) => 
      normalizedEventName.includes(word)
    );
  });
}

export function splitEventsByDate(events: Event[]): {eventsToday: Event[], futureEvents: Event[]} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventsToday: Event[] = [];
  const futureEvents: Event[] = [];

  for (const event of events) {
    const eventDate = parseDateString(event.nice_start_datetime);
    if (isNaN(eventDate.getTime())) {
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
