import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../assets/colors/colors';
import Retour from '../../../assets/images/icons/Retour.png';
import Filtre from '../../../assets/images/icons/Filtre.png';

const HeaderParticipants = ({ onLeftPress, Title, onRightPress }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={onLeftPress} style={styles.backButton}>
        <Image source={Retour} style={styles.buttonImage} />
      </TouchableOpacity>
      <Text style={styles.Title}>{Title}</Text>
      <TouchableOpacity onPress={onRightPress} style={styles.backButton}>
        <Image source={Filtre} style={styles.buttonImageBlack} />
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
    paddingBottom: 12,
    zIndex: 10,
    height: 110,
    backgroundColor: 'white',
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
  buttonImage: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
  buttonImageBlack: {
    tintColor: colors.darkGrey,
    width: 20,
    height: 20,
  },
});

export default HeaderParticipants;
