import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../assets/colors/colors';
import SmallButton from '../buttons/SmallButton';
import retourIcon from '../../../assets/images/icons/Retour.png';
import logOutIcon from '../../../assets/images/icons/Log-out.png';

const HeaderEvent = ({onLeftPress, onRightPress, opacity}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={onLeftPress}
        style={[styles.backButton, {opacity: opacity}]}>
        <Image source={retourIcon} style={styles.buttonImageBlack} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
        <Image source={logOutIcon} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    top: Platform.OS === 'ios' ? 50 : 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingTop: 12,
    position: 'relative',
    maxHeight: 60,
    height: 60,
    zIndex: 10,
  },
  backButton: {
    padding: 10,
  },
  buttonImage: {
    width: 23,
    height: 23,
    tintColor: colors.red,
    zIndex: 2,
  },
  buttonImageBlack: {
    width: 15,
    height: 23,
    tintColor: colors.green,
    zIndex: 2,
  },
});

export default HeaderEvent;
