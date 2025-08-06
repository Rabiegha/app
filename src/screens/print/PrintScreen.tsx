import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useEvent} from '../../context/EventContext';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import PrintComponent from '../../components/screens/print/PrintComponent';
import MainHeader from '../../components/elements/header/MainHeader';

const PrintScreen = ({route, navigation}) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        onLeftPress={handleBackPress}
        title="Paramètres d’impression"
      />
      <View style={globalStyle.container}>
        <PrintComponent
          firstName={undefined}
          lastName={undefined}
          email={undefined}
          navigateBack={handleBackPress}
        />
      </View>
    </View>
  );
};


export default PrintScreen;
