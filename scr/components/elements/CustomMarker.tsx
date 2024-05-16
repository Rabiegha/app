import React from 'react';
import {View, Image, StyleSheet, Animated} from 'react-native';
import ScanCameraIcon from '../../assets/images/icons/ScanCamera.png';

const CustomMarker = () => {
  return (
    <View style={styles.rectangleContainer}>
      <Image
        source={ScanCameraIcon}
        style={[styles.imageStyle]}
        resizeMode="contain"
      />
      <Animated.View />
    </View>
  );
};
const styles = StyleSheet.create({
  rectangleContainer: {
    height: 250,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default CustomMarker;
