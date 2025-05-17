import { Session } from '../../types/session';

export enum SessionStatus {
  FUTURE = 'future',     // Sessions futures
  PAST = 'past'          // Sessions passées
}

/**
 * Détermine le statut d'une session en fonction de sa date
 * @param session Objet session
 * @returns Le statut de la session (future ou past)
 */
export const getSessionStatus = (session: Session): SessionStatus => {
  // Parser la date de début de la session
  const dateStr = session.nice_start_datetime;
  
  if (!dateStr) {
    return SessionStatus.FUTURE; // Par défaut si pas de date
  }
  
  try {
    // Format attendu: "DD/MM/YYYY HH:MM AM/PM", par exemple "29/04/2025 12:00 AM"
    const [datePart, timePart, ampm] = dateStr.split(' ');
    if (!datePart || !timePart) {
      return SessionStatus.FUTURE;
    }
    
    const [day, month, year] = datePart.split('/').map(num => parseInt(num, 10));
    let [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));
    
    // Ajuster les heures pour le format AM/PM
    if (ampm && ampm.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) {
      hours = 0;
    }
    
    // Construire la date (mois en JS commence à 0)
    const sessionDate = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    
    // Si la date n'est pas valide, retourner FUTURE par défaut
    if (isNaN(sessionDate.getTime())) {
      console.log('Date invalide:', dateStr);
      return SessionStatus.FUTURE;
    }
    
    // Calculer la différence en minutes
    const diffMs = sessionDate.getTime() - now.getTime();
    
    // Si la session est dans le passé
    if (diffMs < 0) {
      return SessionStatus.PAST;
    } else {
      return SessionStatus.FUTURE;
    }
  } catch (error) {
    console.error('Erreur lors du parsing de la date:', dateStr, error);
    return SessionStatus.FUTURE; // En cas d'erreur, retourner FUTURE par défaut
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
      case SessionStatus.FUTURE: return 0; // Priorité maximale
      case SessionStatus.PAST: return 1;
      default: return 2;
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
