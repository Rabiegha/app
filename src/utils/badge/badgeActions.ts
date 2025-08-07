import { Alert } from 'react-native';

export const showPrintAlert = () => {
  Alert.alert(
    'Imprimer le badge',
    'Fonctionnalité d\'impression à implémenter',
    [{ text: 'OK' }]
  );
};

export const showModifyAlert = (onConfirm?: () => void) => {
  Alert.alert(
    'Modifier le badge',
    'Redirection vers l\'écran de modification',
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Modifier',
        onPress: onConfirm,
      },
    ]
  );
};

export const showRegenerateAlert = (onConfirm: () => void) => {
  Alert.alert(
    'Régénérer le badge',
    'Êtes-vous sûr de vouloir régénérer ce badge ?',
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Régénérer',
        style: 'destructive',
        onPress: onConfirm,
      },
    ]
  );
};
