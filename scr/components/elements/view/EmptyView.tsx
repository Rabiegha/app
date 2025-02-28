import React from 'react';
import {View, StyleSheet} from 'react-native';
/* import FastImage from 'react-native-fast-image'; */
import empty from '../../../assets/animations/empty.json';
import globalStyle from '../../../assets/styles/globalStyle';
import LottieView from 'lottie-react-native';

export default function EmptyView() {
  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <LottieView
        source={'../../../assets/animations/empty.json'}
        autoPlay
        loop={true}
        style={styles.gifStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  gifStyle: {height: 300, width: 300},
});
