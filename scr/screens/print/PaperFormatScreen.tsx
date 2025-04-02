import {View, Text} from 'react-native';
import React from 'react';
import {PaperFormatComponent} from '../../components/screens/print/PaperFormatComponent';
import HeaderComponent from '../../components/elements/header/HeaderComponent';
import globalStyle from '../../assets/styles/globalStyle';

const PaperFormat = ({route, navigation}) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={'Format du papier'}
        handlePress={handleGoBack}
        color={colors.darkGrey}
        backgroundColor={undefined}
      />
      <View style={globalStyle.container}>
        <PaperFormatComponent />
      </View>
    </View>
  );
};

export default PaperFormat;
