// MenuScreen.js
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import MainHeader from '../../components/elements/header/MainHeader';

const HelpScreen = ({navigation}) => {
  const goBack = () => {
    navigation.goBack();
  };
  const sections = [
    {
      title: 'Menu',
      buttons: [
        {title: 'Participants', action: () => navigation.navigate('Attendees')},
        {title: 'Ajouts', action: () => navigation.navigate('Add')},
        {title: 'Scan', action: () => navigation.navigate('Scan')},
        {title: 'Scan', action: () => navigation.navigate('Scan')},
      ],
    },
    {
      title: 'Aide & Support',
      buttons: [
        {title: 'A propos', action: () => navigation.navigate('About')},
        {title: 'Centre d’aide', action: () => navigation.navigate('More')},
      ],
    },
    // Add more sections as needed
  ];

  return (
    <View style={globalStyle.backgroundBlack}>
      <MainHeader
      title={'Centre d’aide'}
      onLeftPress={goBack}
      backgroundColor={colors.darkGrey}
      color={colors.greyCream}
      />
      <View style={[globalStyle.container, styles.wrapper]}>
        <View>
          <Text style={styles.text}>Coming soon</Text>
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
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 300,
  },
  text: {
    color: colors.greyCream,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HelpScreen;
