import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../assets/colors/colors';
import Retour from '../../../assets/images/icons/Retour.png';

const MainHeader = ({ onLeftPress, title, onRightPress, RightIcon = null, backgroundColor = 'white', color = colors.darkGrey, leftButtonTintColor = colors.green, rightBottonColor = colors.darkGrey, size = 20 }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 5, backgroundColor}]}>
      <TouchableOpacity onPress={onLeftPress} style={styles.backButton}>
        <Image source={Retour} style={[styles.leftButton, {tintColor: leftButtonTintColor}]} />
      </TouchableOpacity>
      <Text style={[styles.title, {color: color}]}>{title}</Text>
      {RightIcon ? (
        <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
          <Image source={RightIcon} style={{tintColor: rightBottonColor, height: size, width: size}} />
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
    minHeight: 110,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    maxWidth: 200,
    flexShrink: 2,
  },
  leftButton: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
});

export default MainHeader;
