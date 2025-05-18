import React from 'react';
import { TouchableOpacity, StyleSheet, Image, View, Platform } from 'react-native';
import Icons from '../../../assets/images/icons';
import colors from '../../../assets/colors/colors';

interface FloatingSearchButtonProps {
  onPress: () => void;
}

const FloatingSearchButton = ({ onPress }: FloatingSearchButtonProps) => {
  return (
    <View style={styles.buttonContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 70,
    height: 70,
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
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
});

export default FloatingSearchButton;
