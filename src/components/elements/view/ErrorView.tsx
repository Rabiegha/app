import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../../assets/colors/colors';
import globalStyle from '../../../assets/styles/globalStyle';
import LottieView from 'lottie-react-native';
import errorAnimation from '../../../assets/animations/Error.json';

interface ErrorViewProps {
  handleRetry: () => void;
  message?: string;
}

export default function ErrorView({handleRetry, message = 'An error occurred'}: ErrorViewProps) {
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <LottieView
        source={errorAnimation}
        autoPlay
        loop={true}
        style={styles.gifStyle}
      />
      {message && <Text style={styles.errorMessage}>{message}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonTexte}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center'},
  button: {
    backgroundColor: colors.green,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonTexte: {color: 'white', fontSize: 16},
  gifStyle: {
    height: 220,
     width: 220,
     margin: 0,
     padding: 0,
     alignSelf: 'center',
    },
  errorMessage: {
    color: colors.red,
    marginVertical: 10,
    textAlign: 'center',
    fontSize: 16,
  },
});
