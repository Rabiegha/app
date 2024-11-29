import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Animated,
  Modal,
  TouchableOpacity,
} from 'react-native';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../../colors/colors';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {EventProvider, useEvent} from '../../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import ScanModal from '../modals/ScanModal';
import {scanAttendee} from '../../services/serviceApi';
import usePrintDocument from '../../hooks/usePrintDocument';
import useUserId from '../../hooks/useUserId';
import {RNCamera} from 'react-native-camera';

const ScannerComponent = () => {
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {triggerListRefresh, eventId} = useEvent();
  const [scannerActive, setScannerActive] = useState(true);
  const cameraRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanAnimation] = useState(new Animated.Value(0));
  const [markerColor, setMarkerColorr] = useState('white');
  const [modalVisible, setModalVisible] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);

  /*   const [attendeeId, setAttendeeId] = useState(null); */
  const {userId} = useUserId();
  const {printDocument} = usePrintDocument();

  // Handle the back press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle modal close
  const handleAlertClose = () => {
    setAlertVisible(false); // Close the modal
    triggerListRefresh(); // Refresh attendee list
  };

  // Handle QR code scan success
  const onSuccess = async e => {
    if (alertVisible) {
      return;
    }

    const data = e.data; // QR code content

    try {
      const response = await scanAttendee(userId, eventId, data);
      console.log('API Response:', response);

      if (response.status === true) {
        const attendeeId = response.attendee_details.attendee_id;
        console.log('Extracted attendeeId:', attendeeId);

        setModalMessage('Participation enregistrée.');
        setIsAccepted(true);
        setAlertVisible(true);

        // Trigger print

        printDocument(attendeeId);
      } else {
        setModalMessage("Impossible d'enregistrer la participation.");
        setIsAccepted(false);
        setAlertVisible(true);
      }

      setTimeout(() => {
        setAlertVisible(false);
        triggerListRefresh();
        navigation.navigate('Attendees');
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setModalMessage("Impossible d'enregistrer la participation.");
      setIsAccepted(false);
      setAlertVisible(true);

      setTimeout(() => {
        setAlertVisible(false);
        triggerListRefresh();
        navigation.navigate('Attendees');
      }, 2000);
    }
  };

  // Manage scanner activation on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setAlertVisible(false);
      setScannerActive(true);
    });

    const blurUnsubscribe = navigation.addListener('blur', () => {
      setScannerActive(false);
    });

    return () => {
      unsubscribe();
      blurUnsubscribe();
    };
  }, [navigation]);

  // Start scanning animation
  const startScanAnimation = () => {
    if (isScanning) {
      return;
    }

    setIsScanning(true);
    setMarkerColorr(colors.green);

    Animated.timing(scanAnimation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      scanAnimation.setValue(0);
      setIsScanning(false);
      setMarkerColorr('white'); // Reset overlay color
    });
  };

  // Simulate delay to match animation duration
  const onBarCodeRead = async ({data}) => {
    if (isScanning || modalVisible) {
      return;
    }

    startScanAnimation();

    // Simulate delay to match animation duration
    setTimeout(async () => {
      try {
        // Call your scanAttendee API
        const response = await scanAttendee(userId, eventId, data);
        console.log('API Response:', response);

        if (response.status === true) {
          const attendee = await response.attendee_details;
          setAttendeeData({
            id: attendee.attendee_id,
            name: attendee.attendee_name,
          });
        } else {
          setAttendeeData(null);
        }

        setModalVisible(true);
      } catch (error) {
        console.error('Error during scanning:', error);
        setAttendeeData(null);
        setModalVisible(true);
      }
    }, 1500); // Match the duration of the scan animation
  };

  // Handle Check-In button press
  const handleCheckIn = () => {
    setModalVisible(false);
    // Proceed with check-in logic
    if (attendeeData) {
      // Trigger print
      printDocument(attendeeData.id);
      // Additional check-in logic if needed
    }
    // Reset for next scan
    setAttendeeData(null);
  };

  // Handle modal close without check-in
  const handleCancel = () => {
    setModalVisible(false);
    setAttendeeData(null);
  };

  return (
    <EventProvider>
      <View style={styles.container}>
        {/*         <View style={styles.overlay}> */}
        <HeaderComponent
          title={'Scan QR Code'}
          color={colors.greyCream}
          handlePress={handleBackPress}
        />
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          onBarCodeRead={onBarCodeRead}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {/* Overlay with changing color */}
          <View style={[styles.overlay]}>
            {/* Use your CustomMarker */}
            <CustomMarker
              markerColor={markerColor}
              isScanning={isScanning}
              scanAnimation={scanAnimation}
            />
          </View>
        </RNCamera>

        {/* Modal for attendee details */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancel}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {attendeeData ? (
                <>
                  <Text style={styles.modalTitle}>Attendee Found</Text>
                  <Text style={styles.modalText}>{attendeeData.name}</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleCheckIn}>
                    <Text style={styles.buttonText}>Check-In</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.modalTitle}>Attendee Not Found</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleCancel}>
                    <Text style={styles.buttonText}>OK</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Not found</Text>
        </View>
        <ScanModal
          visible={alertVisible}
          onClose={handleAlertClose}
          isAccepted={isAccepted}
          message={modalMessage}
        />
      </View>
      {/* {!alertVisible && scannerActive && (
          <QRCodeScanner
            onRead={onSuccess}
            bottomContent={<View />}
            showMarker
            checkAndroid6Permissions
            cameraStyle={styles.cameraStyle}
            customMarker={<CustomMarker />}
          />
        )} */}
      {/*       </View> */}
    </EventProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {flex: 1},
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    width: '50%', // Adjust as needed
    height: 4,
    backgroundColor: 'white',
  },
  cameraStyle: {
    height: '98%',
    top: 30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  modalText: {fontSize: 18, marginBottom: 20},
  button: {
    backgroundColor: colors.primary, // Replace with your primary color
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {color: 'black', fontSize: 18, fontWeight: 'bold'},
  notFoundText: {
    color: 'white',
  },
  notFoundContainer: {
    backgroundColor: 'red',
    padding: 10,
    paddingHorizontal: 50,
    zIndex: 100,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      {translateX: -75}, // Move half width left
      {translateY: -25}, // Move half height up
    ],
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default ScannerComponent;
