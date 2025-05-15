import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import emptyAnimation from '../../../assets/animations/Empty.json';
import globalStyle from '../../../assets/styles/globalStyle';
import LottieView from 'lottie-react-native';
import colors from '../../../assets/colors/colors';

export default function EmptyView({handleRetry, text}) {
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <LottieView
        source={emptyAnimation}
        autoPlay
        loop={true}
        style={styles.gifStyle}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonTexte}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  gifStyle: {
    height: 330,
     width: 330,
     margin: 0,
     padding: 0,
     alignSelf: 'center',
    },
  button: {
    backgroundColor: colors.green,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: -50,
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  buttonTexte: {color: 'white'},
});
