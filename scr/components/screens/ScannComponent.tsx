import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../../colors/colors';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import {EventProvider, useEvent} from '../../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import {BASE_URL} from '../../config/config';
import ScanModal from '../modals/ScanModal';

const ScannerComponent = () => {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [modalMessage, SetModalMessage] = useState('');
  const {triggerListRefresh} = useEvent();
  const [scannerActive, setScannerActive] = useState(true);
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
        name: '',
        email: '',
        organization: '',
        uid: '',
      };

      // URL de l'API pour enregistrer les participants en scannant le code QR
      const apiUrl = `${BASE_URL}/ajax_join_attendee/?event_id=${payload.event_id}&content=${data}`;
      axios
        .post(apiUrl, payload)
        .then(response => {
          // Succès de l'enregistrement, afficher une alerte ou effectuer d'autres actions
          setAlertVisible(true);
          if (response.data.status === true) {
            SetModalMessage('Participation enregistrée.');
            setIsAccepted(true);
            console.log(data);
            setTimeout(() => {
              setAlertVisible(false);
              triggerListRefresh();
              navigation.navigate('Attendees');
            }, 2000);
          } else {
            SetModalMessage("Impossible d'enregistrer la participation.");
            setIsAccepted(false);
            // Error scenario
            setTimeout(() => {
              setAlertVisible(false);
              triggerListRefresh();
              navigation.navigate('Attendees');
            }, 2000);
            console.error(
              "Erreur lors de l'enregistrement:",
              response.data.message,
            ); // Assuming 'message' contains the error message
            console.log(data);
          }
        })
        .catch(error => {
          // Échec de l'enregistrement, afficher une alerte d'erreur
          console.error("Erreur lors de l'enregistrement:", error);
          setAlertVisible(true);
          setIsAccepted(false);
          SetModalMessage("Impossible d'enregistrer la participation.");
          setTimeout(() => {
            setAlertVisible(false);
            triggerListRefresh();
            navigation.navigate('Attendees');
          }, 2000);
        });
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Réinitialiser l'état lorsque le composant est monté ou revenu à la vue
      setAlertVisible(false);
      setScannerActive(true);
    });

    const blurUnsubscribe = navigation.addListener('blur', () => {
      setScannerActive(false); // Désactiver le scanner lors de la navigation vers un autre écran
    });

    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation]);

  return (
    <EventProvider>
      <View style={styles.container}>
        <ScanModal
          visible={alertVisible}
          onClose={handleAlertClose}
          isAccepted={isAccepted}
          message={modalMessage}
          onPress={undefined}
          value={undefined}
          onChangeText={undefined}
          isValidationMessageVisible={undefined}
        />
        <View style={styles.overlay}>
          <HeaderComponent
            title={'Scan QR Code'}
            color={colors.greyCream}
            handlePress={handleBackPress}
          />
        </View>
        {!alertVisible && scannerActive && (
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
