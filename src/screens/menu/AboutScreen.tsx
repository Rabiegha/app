import React from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import MenuListComponent from '../../components/screens/MenuListComponent';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import MainHeader from '../../components/elements/header/MainHeader';

const AboutScreen = ({navigation}) => {
  const goBack = () => {
    navigation.goBack();
  };
  const sections = [
    {
      title: 'Menu',
      buttons: [
        {
          title: 'Règles de la Maison',
          action: () =>
            navigation.navigate('WebView', {
              url: 'https://attendee-app.fr/R%C3%A8gles-de-la-Maison.html',
            }),
        },
        {
          title: 'Politique de confidentialité',
          action: () =>
            navigation.navigate('WebView', {
              url: 'https://attendee-app.fr/politique-de-confidentialite.html',
            }),
        },
        {
          title: "conditions d'utilisation",
          action: () =>
            navigation.navigate('WebView', {
              url: "https://attendee-app.fr/conditions-d'utilisation.html",
            }),
        },
        /*         {
          title: 'Cookies',
          action: () =>
            navigation.navigate('WebView', {
              url: 'https://choyou.fr/privacystatement.html',
            }),
        }, */
      ],
    },
  ];

  return (
    <View style={globalStyle.backgroundBlack}>

      <MainHeader
        title={'À propos'}
        onLeftPress={goBack}
        backgroundColor={colors.darkGrey}
        color={colors.greyCream}
        />
      <View style={globalStyle.container}>
        <View style={{top: 60}}>
          <MenuListComponent sections={sections} />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AboutScreen;
