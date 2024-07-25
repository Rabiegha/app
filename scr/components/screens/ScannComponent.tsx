import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../../colors/colors';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import {EventProvider, useEvent} from '../../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import { BASE_URL } from '../../config/config';

const ScannerComponent = () => {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const {triggerListRefresh} = useEvent();
  const {eventId} = useEvent();

  // Définir 'handleBackPress' correctement à l'intérieur du composant pour accéder à 'navigation'
  const handleBackPress = () => {
    navigation.goBack(); // Utilisez `goBack` ou la navigation spécifique selon vos besoins
  };

  const handleAlertClose = () => {
    setAlertVisible(false); // Réactiver le scanner une fois l'alerte fermée
    triggerListRefresh();
  };

  const onSuccess = e => {
    if (!alertVisible) {
      const data = e.data;
      const payload = {
        event_id: eventId,
        name: data,
      };

      // URL de l'API pour enregistrer les participants en scannant le code QR
      const apiUrl = `${BASE_URL}/ajax_join_attendee/?event_id=${payload.event_id}&content=${data}`;

      axios
        .post(apiUrl, payload)
        .then(response => {
          // Succès de l'enregistrement, afficher une alerte ou effectuer d'autres actions
          if (response.data.status === true) {
            setAlertVisible(true);
            Alert.alert('Succès', 'Participation enregistrée.', [
              {text: 'OK', onPress: handleAlertClose},
            ]);
            console.log(data);
          } else {
            // Error scenario
            console.error(
              "Erreur lors de l'enregistrement:",
              response.data.message,
            ); // Assuming 'message' contains the error message
            setAlertVisible(true);
            Alert.alert(
              'Erreur',
              "Impossible d'enregistrer la participation.",
              [{text: 'OK', onPress: handleAlertClose}],
            );
            console.log(data);
          }
        })
        .catch(error => {
          // Échec de l'enregistrement, afficher une alerte d'erreur
          console.error("Erreur lors de l'enregistrement:", error);
          setAlertVisible(true);
          Alert.alert('Erreur', "Impossible d'enregistrer la participation.", [
            {text: 'OK', onPress: handleAlertClose},
          ]);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Réinitialiser l'état lorsque le composant est monté ou revenu à la vue
      setAlertVisible(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <EventProvider>
      <View style={styles.container}>
        <View style={styles.overlay}>
          <HeaderComponent
            title={'Scan QR Code'}
            color={colors.greyCream}
            handlePress={handleBackPress}
          />
        </View>
        {!alertVisible && (
          <QRCodeScanner
            onRead={onSuccess}
            bottomContent={<View />}
            showMarker={true}
            checkAndroid6Permissions={true}
            cameraStyle={{height: '98%', top: 30}}
            customMarker={<CustomMarker />}
          />
        )}
      </View>
    </EventProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  overlay: {
    zIndex: 1,
  },
});

export default ScannerComponent;
