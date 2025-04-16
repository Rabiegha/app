import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HeaderComponent from '../../components/elements/header/HeaderComponent';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import Search from '../../components/elements/Search';

const SessionAttendeesListScreen = () => {

    const navigation = useNavigation();

    // Navigate back
    const handleGoBack = () => {
      navigation.goBack();
    };
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Ajouter"
        color={colors.darkGrey}
        handlePress={handleGoBack}
        backgroundColor={'white'}
      />
      <Search
        onChange={undefined}
        value={undefined}
      />
      <Text>Session</Text>
    </View>
  )
}

const style = StyleSheet.create({

})

export default SessionAttendeesListScreen;