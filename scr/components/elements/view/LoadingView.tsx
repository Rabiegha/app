import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import colors from '../../../assets/colors/colors';
import globalStyle from '../../../assets/styles/globalStyle';

export default function LoadingView() {
  return (
    <View style={[styles.container]}>
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
