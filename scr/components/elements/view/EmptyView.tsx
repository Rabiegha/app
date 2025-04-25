import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import emptyAnimation from '../../../assets/animations/Empty.json';
import globalStyle from '../../../assets/styles/globalStyle';
import LottieView from 'lottie-react-native';
import colors from '../../../assets/colors/colors';

export default function EmptyView({handleRetry}) {
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <LottieView
        source={emptyAnimation}
        autoPlay
        loop={true}
        style={styles.gifStyle}
      />
            <TouchableOpacity style={styles.button} onPress={handleRetry}>
              <Text style={styles.buttonTexte}>Réessayer</Text>
              <Text style={styles.emptyText}>Aucun participant pour cette session.</Text>
            </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  gifStyle: {height: 300, width: 300},
  button: {
    backgroundColor: colors.green,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  buttonTexte: {color: 'white'},
});
