import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import colors from '../../../assets/colors/colors';
import globalStyle from '../../../assets/styles/globalStyle';

export default function LoadingView() {
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
