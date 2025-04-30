import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../assets/colors/colors';
import retourIcon from '../../../assets/images/icons/Retour.png';

const HeaderComponent = ({ title, handlePress, color, backgroundColor }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: backgroundColor, paddingTop: insets.top + 12 }, // ✅ Add dynamic padding
      ]}
    >
      <TouchableOpacity onPress={handlePress || handleGoBack} style={styles.backButton}>
        <Image source={retourIcon} style={styles.buttonImage} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color }]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100, // Fixe mais sera "décalé" proprement avec paddingTop dynamique
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
    zIndex: 2,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30, // Pour que le bouton retour ne bloque pas le texte centré
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGrey,
    textAlign: 'center',
  },
  buttonImage: {
    width: 15,
    height: 23,
    tintColor: colors.green,
  },
});

export default HeaderComponent;
