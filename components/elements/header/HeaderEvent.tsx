import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../colors/colors';
import SmallButton from '../buttons/SmallButton';

const HeaderEvent = ({onLeftPress, onRightPress}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onLeftPress} style={styles.backButton}>
        <Image
          source={require('../../../assets/images/icons/Log-out.png')}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
        <Image
          source={require('../../../assets/images/icons/Filtre.png')}
          style={styles.buttonImageBlack}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    top: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', // Align items to start
    alignItems: 'center',
    paddingHorizontal: 20,
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
    tintColor: colors.darkGrey,
    width: 20,
    height: 20,
  },
});

export default HeaderEvent;