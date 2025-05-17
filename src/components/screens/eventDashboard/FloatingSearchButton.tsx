import React from 'react';
import { TouchableOpacity, StyleSheet, Image, Animated } from 'react-native';
import Icons from '../../../assets/images/icons';
import colors from '../../../assets/colors/colors';

interface FloatingSearchButtonProps {
  onPress: () => void;
}

const FloatingSearchButton = ({ onPress }: FloatingSearchButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={Icons.Rechercher}
        style={styles.searchIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default FloatingSearchButton;
