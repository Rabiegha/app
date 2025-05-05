import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../assets/colors/colors';
import Retour from '../../../assets/images/icons/Retour.png';

const MainHeader = ({ onLeftPress, title, onRightPress, RightIcon = null, backgroundColor = 'white', color = colors.darkGrey, leftButtonTintColor = colors.green }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 12, backgroundColor}]}>
      <TouchableOpacity onPress={onLeftPress} style={styles.backButton}>
        <Image source={Retour} style={[styles.leftButton, {tintColor: leftButtonTintColor}]} />
      </TouchableOpacity>
      <Text style={[styles.Title, {color: color}]}>{title}</Text>
      {RightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
          <Image source={RightIcon} style={styles.rightButton} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
    height: 80,
  },
  backButton: {
    padding: 10,
  },
  Title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    maxWidth: 200,
    color: colors.darkGrey,
    height: 'auto',
  },
  leftButton: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
  rightButton: {
    tintColor: colors.darkGrey,
    width: 20,
    height: 20,
  },
});

export default MainHeader;
