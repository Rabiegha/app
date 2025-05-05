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

const styles = StyleSheet.create({
  container: {
    marginLeft: 30,
    marginRight: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemName: {
    fontSize: 18,
    top: 50,
  },
});

export default PrintScreen;
