export const TOAST_MESSAGES = {
    errors: {
      generic: 'Une erreur est survenue. Veuillez réessayer.',
      timeout: 'La requête a expiré. Vérifiez votre connexion.',
      noResponse: 'Pas de réponse du serveur.',
      serverError: (code) => `Erreur serveur (${code})`,
      custom: (msg) => `Erreur : ${msg}`,
    },
    success: {
      saved: 'Enregistré avec succès.',
      updated: 'Mise à jour réussie.',
      deleted: 'Supprimé avec succès.',
    },
  };
