import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../assets/colors/colors';

const AboutListComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Titre en Gras</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Bouton 1</Text>
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Bouton 2</Text>
        <Icon name="chevron-right" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.darkerGrey,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.greyCream,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 13,
    color: '#000',
    color: colors.greyCream,
  },
});

export default AboutListComponent;
