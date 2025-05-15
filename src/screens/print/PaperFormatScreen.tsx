import {View, Text} from 'react-native';
import React from 'react';
import {PaperFormatComponent} from '../../components/screens/print/PaperFormatComponent';
import globalStyle from '../../assets/styles/globalStyle';
import MainHeader from '../../components/elements/header/MainHeader';

const PaperFormat = ({route, navigation}) => {
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        title={'Format du papier'}
        onLeftPress={handleGoBack}
      />
      <View style={globalStyle.container}>
        <PaperFormatComponent />
      </View>
    </View>
  );
};

export default PaperFormat;
