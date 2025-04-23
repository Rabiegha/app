import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../assets/colors/colors';
import retourIcon from '../../../assets/images/icons/Retour.png';

const HeaderComponent = ({title, handlePress, color, backgroundColor}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[styles.headerContainer, {backgroundColor: backgroundColor}]}>
      <TouchableOpacity onPress={handlePress} style={styles.backButton}>
        <Image source={retourIcon} style={styles.buttonImage} />
      </TouchableOpacity>
      <Text style={[styles.title, {color}]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    position: 'relative',
    height: 120,
    zIndex: 10,
  },
  title: {
    top: 60,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGrey,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 52,
    justifyContent: 'center',
    padding: 10,
    zIndex: 10,
    marginLeft: 20,
  },
  buttonImage: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
});

export default HeaderComponent;
