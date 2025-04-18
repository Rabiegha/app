import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useEvent} from '../../context/EventContext';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import PrintComponent from '../../components/screens/print/PrintComponent';
import HeaderComponent from '../../components/elements/header/HeaderComponent';

const ProfilScreen = ({route, navigation}) => {
  const handleGoBack = () => {
    navigation.navigate('Attendees');
  };
  const {triggerListRefresh} = useEvent();
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={'Paramètres d’impression'}
        handlePress={handleGoBack}
        color={colors.darkGrey}
        backgroundColor={undefined}
      />
      <View style={globalStyle.container}>
        <PrintComponent
          firstName={undefined}
          lastName={undefined}
          email={undefined}
          navigateBack={handleGoBack}
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

export default ProfilScreen;
