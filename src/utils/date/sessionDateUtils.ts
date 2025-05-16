import { Session } from '../../types/session';

export enum SessionStatus {
  UPCOMING = 'upcoming',  // Dans moins de 15 minutes
  FUTURE = 'future',     // Plus de 15 minutes dans le futur
  PAST = 'past'          // Sessions passées
}

/**
 * Détermine le statut d'une session en fonction de sa date
 * @param session Objet session
 * @returns Le statut de la session (upcoming, future, ou past)
 */
export const getSessionStatus = (session: Session): SessionStatus => {
  // Parser la date de début de la session
  const dateStr = session.nice_start_datetime;
  
  // Format général attendu: "DD MMM YYYY à HH:MM"
  const regex = /(\d{1,2})\s+([A-Za-zûé]+)\s+(\d{4})\s+à\s+(\d{1,2}):(\d{2})/;
  const match = dateStr.match(regex);
  
  if (!match) {
    return SessionStatus.FUTURE; // Par défaut
  }
  
  // Le format semble être "DD MMM YYYY à HH:MM" en français
  const day = parseInt(match[1], 10);
  const monthStr = match[2].toLowerCase();
  const year = parseInt(match[3], 10);
  const hours = parseInt(match[4], 10);
  const minutes = parseInt(match[5], 10);
  
  // Conversion du mois en nombre (0-11)
  const monthMap: Record<string, number> = {
    'jan': 0, 'fév': 1, 'mar': 2, 'avr': 3, 'mai': 4, 'juin': 5,
    'juil': 6, 'août': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'déc': 11
  };
  
  let month = -1;
  for (const [key, value] of Object.entries(monthMap)) {
    if (monthStr.startsWith(key)) {
      month = value;
      break;
    }
  }
  
  if (month === -1) {
    return SessionStatus.FUTURE; // Si mois non reconnu
  }
  
  const sessionDate = new Date(year, month, day, hours, minutes);
  const now = new Date();
  
  // Calculer la différence en minutes
  const diffMs = sessionDate.getTime() - now.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  
  if (diffMinutes < 0) {
    return SessionStatus.PAST;
  } else if (diffMinutes <= 15) {
    return SessionStatus.UPCOMING;
  } else {
    return SessionStatus.FUTURE;
  }
};

/**
 * Trie les sessions pour afficher d'abord les sessions à venir
 * @param sessions Liste des sessions
 * @returns Liste triée des sessions
 */
export const sortSessionsByStatus = (sessions: Session[]): Session[] => {
  // Créer une fonction pour obtenir le poids de priorité par statut
  const getStatusPriority = (status: SessionStatus): number => {
    switch (status) {
      case SessionStatus.UPCOMING: return 0; // Priorité maximale
      case SessionStatus.FUTURE: return 1;
      case SessionStatus.PAST: return 2;
      default: return 3;
    }
  };

  return [...sessions].sort((a, b) => {
    const statusA = getSessionStatus(a);
    const statusB = getSessionStatus(b);
    
    // D'abord par statut
    const priorityDiff = getStatusPriority(statusA) - getStatusPriority(statusB);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Ensuite par date (uniquement si même statut)
    const dateA = new Date(a.nice_start_datetime);
    const dateB = new Date(b.nice_start_datetime);
    return dateA.getTime() - dateB.getTime();
  });
};
