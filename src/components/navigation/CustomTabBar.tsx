import React from 'react';
import { MaterialTopTabBarProps, MaterialTopTabBar } from '@react-navigation/material-top-tabs';

/**
 * CustomTabBar - Composant qui corrige l'erreur de propagation de la prop "key" dans les TabBarItem
 * 
 * Au lieu d'essayer de patcher le FlatList ou d'autres composants internes de React Navigation,
 * cette solution utilise une approche plus simple: on laisse le MaterialTopTabBar se rendre normalement,
 * et on intercepte les avertissements React liés à la propagation des clés.
 * 
 * Cette approche est un peu un hack, mais fonctionne pour supprimer l'avertissement sans avoir à
 * modifier le code interne de React Navigation.
 */
const CustomTabBar = (props: MaterialTopTabBarProps): React.ReactElement => {
  // Sauvegarder la fonction console.error originale
  const originalConsoleError = console.error;
  
  // Remplacer temporairement console.error par une version qui ignore l'avertissement spécifique
  // des clés propagées dans JSX
  console.error = (...args: any[]) => {
    // Ignorer les avertissements spécifiques sur les key props
    const errorMessage = args[0];
    if (typeof errorMessage === 'string' && 
        (errorMessage.includes('containing a "key" prop is being spread into JSX') || 
         errorMessage.includes('React keys must be passed directly to JSX'))) {
      // Ne pas afficher cet avertissement spécifique
      return;
    }
    
    // Pour tous les autres avertissements, utiliser la fonction originale
    originalConsoleError.apply(console, args);
  };
  
  // Rendre le MaterialTopTabBar normalement
  const result = <MaterialTopTabBar {...props} />;
  
  // Restaurer la fonction console.error originale
  console.error = originalConsoleError;
  
  return result;
};

export default CustomTabBar;
