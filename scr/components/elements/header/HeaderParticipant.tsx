import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet, Platform} from 'react-native';
import colors from '../../../assets/colors/colors';
import Retour from '../../../assets/images/icons/Retour.png';
import Filtre from '../../../assets/images/icons/Filtre.png';

const HeaderParticipants = ({onLeftPress, Title, onRightPress}) => {
  return (
    <View style={styles.headerContainer}>
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
    top: Platform.OS === 'ios' ? 50 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingTop: 12,
    maxHeight: 60,
    height: 60,
    zIndex: 10,
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
  },
  buttonImage: {
    width: 15,
    height: 23,
    tintColor: colors.green,
    zIndex: 2,
  },
  buttonImageBlack: {
    tintColor: colors.darkGrey,
    width: 20,
    height: 20,
  },
});

export default HeaderParticipants;
