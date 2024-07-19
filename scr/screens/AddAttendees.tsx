import React, {useContext, useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import AddAttendeesComponent from '../components/screens/AddAttendeesComponent';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import {useEvent} from '../context/EventContext';

const AddAttendeesScreen = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content'); // Set status bar style to light-content
      return () => {
        // This is useful if this screen has a unique StatusBar style                                                                                                                                                          '); // Reset status bar style when screen loses focus
      };
    }, []),
  );

  const [success, setSuccess] = useState(null);
  const {secretCode, eventId} = useEvent();
  const handleEnregistrer = () => {
    // Logique pour traiter les données du formulaire

    // Simulons le succès ou l'échec de l'enregistrement ici
    const enregistrementReussi = false; // Mettez à false pour simuler un échec

    if (enregistrementReussi) {
      setSuccess(true); // Enregistrement réussi
    } else {
      setSuccess(false); // Enregistrement échoué
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Réinitialiser isVisible à false lorsque l'écran est défocus
      return () => setSuccess(null);
    }, []),
  );

  const handleGoBack = () => {
    navigation.navigate('Attendees');
  };
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Attendees"
        color={undefined}
        handlePress={handleGoBack}
      />
      {/*       <Text>Secret Code: {secretCode}</Text>
      <Text>Event ID: {eventId}</Text> */}
      <AddAttendeesComponent
        onPress={handleEnregistrer}
        style={[globalStyle.container, {marginTop: 50}]}
      />
    </View>
  );
};

export default AddAttendeesScreen;
