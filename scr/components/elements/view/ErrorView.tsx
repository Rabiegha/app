import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../../assets/colors/colors';
import globalStyle from '../../../assets/styles/globalStyle';

export default function ErrorView({handleRetry}) {
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <Text>Une erreur est survenue</Text>
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonTexte}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    backgroundColor: colors.green,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonTexte: {color: 'white'},
});
