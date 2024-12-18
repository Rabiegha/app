import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../../assets/colors/colors';
import ProgressText from './ProgressionText';

const ProgressBar = ({progress}) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, {width: `${progress}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    width: '60%',
    height: 6,
    backgroundColor: '#ccc', // Fond gris
    borderRadius: 10, // Bordures rondes des deux côtés
    overflow: 'hidden', // Pour assurer que le débordement est caché avec les bordures rondes
    marginTop: 10,
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.green, // Couleur verte pour la progression
    borderRadius: 10, // Bordures rondes des deux côtés
  },
});

export default ProgressBar;
