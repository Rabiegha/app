import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../assets/colors/colors';
import Icons from '@/assets/images/icons';

const HeaderEvent = ({ onLeftPress, onRightPress, opacity = 1 }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 12 }]}>
      <TouchableOpacity
        onPress={onLeftPress}
        style={[styles.button, { opacity }]}
      >
        <Image source={Icons.Retour} style={styles.backButtonImage} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onRightPress}
        style={styles.button}
      >
        <Image source={Icons.LogOut} style={styles.logoutButtonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white', // Ajouté pour éviter la transparence si nécessaire
    height: 80,
    zIndex: 10,
  },
  button: {
    padding: 10,
  },
  backButtonImage: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
  logoutButtonImage: {
    width: 23,
    height: 23,
    tintColor: colors.red,
  },
});

export default HeaderEvent;
