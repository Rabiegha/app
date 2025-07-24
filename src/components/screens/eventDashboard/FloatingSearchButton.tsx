import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View, Platform, ImageSourcePropType } from 'react-native';

import colors from '../../../assets/colors/colors';

interface FloatingSearchButtonProps {
  onPress: () => void;
  icon?: ImageSourcePropType;
  size?: number;
}

const FloatingButton = ({ onPress, icon, size = 24 }: FloatingSearchButtonProps) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Image
          source={icon}
          style={[styles.searchIcon, {height: size, width: size}]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    bottom: 120,
    height: 70,
    position: 'absolute',
    right: 20,
    width: 70,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    zIndex: 999,
  },
  floatingButton: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 35,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  searchIcon: {
    tintColor: colors.white,
  },
});

export default FloatingButton;
