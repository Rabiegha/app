import React from 'react';
import {View, Image, StyleSheet, Animated} from 'react-native';
import ScanCameraIcon from '../../assets/images/icons/ScanCamera.png';

const CustomMarker = ({markerColor, isScanning, scanAnimation}) => {
  return (
    <View style={styles.rectangleContainer}>
      <Image
        source={ScanCameraIcon}
        style={[styles.imageStyle, {tintColor: markerColor}]}
        resizeMode="contain"
      />
      {isScanning && (
        <Animated.View
          style={[
            styles.scanLine,
            {
              transform: [
                {
                  translateY: scanAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 250 - 4], // Adjust if needed
                  }),
                },
              ],
            },
          ]}
        />
      )}
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
  scanLine: {
    position: 'absolute',
    width: '80%', // Adjust as needed
    height: 4,
    backgroundColor: 'white',
  },
});

export default CustomMarker;
