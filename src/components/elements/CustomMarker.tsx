import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Icons from '@/assets/images/icons';

type Props = {
  markerColor?: string;
};

const CustomMarker: React.FC<Props> = ({markerColor}) => {
  return (
    <View style={styles.rectangleContainer}>
      <Image
        source={Icons.ScanCamera}
        style={[styles.imageStyle, {tintColor: markerColor}]}
        resizeMode="contain"
      />
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
});

export default CustomMarker;
