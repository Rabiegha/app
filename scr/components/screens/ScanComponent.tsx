// src/components/ScannerComponent.js

import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../assets/colors/colors';
import {useEvent} from '../../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import ScanModal from '../modals/ScanModal';
import {scanAttendee} from '../../services/scanAttendeeService';
import usePrintDocument from '../../hooks/print/usePrintDocument';
import useUserId from '../../hooks/useUserId';
import {useSelector} from 'react-redux';
import {
  selectPrintStatus,
  selectAutoPrint,
} from '../../redux/selectors/print/printerSelectors';

const ScanComponent = () => {
  const navigation = useNavigation();
  const {triggerListRefresh, eventId} = useEvent();
  const cameraRef = useRef(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const [markerColor] = useState('white');
  const [modalVisible, setModalVisible] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle');

  const {userId} = useUserId();
  const {printDocument} = usePrintDocument();

  const printStatus = useSelector(selectPrintStatus);
  const autoPrint = useSelector(selectAutoPrint);
  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );

  useEffect(() => {
    const nodePrinterId = selectedNodePrinter?.id;
    console.log(
      'Updated selectedNodePrinter in ScannerComponent:',
      nodePrinterId,
    );
  }, [selectedNodePrinter]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetScanner();
    });
    return unsubscribe;
  }, [navigation]);

  const resetScanner = () => {
    setAttendeeData(null);
    setModalVisible(false);
    setScanStatus('idle');
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const onBarCodeRead = async ({data}) => {
    if (scanStatus !== 'idle' || modalVisible) {
      return;
    }

    setScanStatus('scanning');
    await delay(500);

    try {
      const response = await scanAttendee(userId, eventId, data);
      console.log('API Response:', response);
      if (response.status === true) {
        const attendee = response.attendee_details;
        setAttendeeData({
          id: attendee.attendee_id,
          name: attendee.attendee_name,
        });
        setScanStatus('found');

        await delay(500);

        setModalVisible(true);
        setScanStatus('approved');
        triggerListRefresh();

        await delay(2000);

        if (autoPrint) {
          setScanStatus('printing');
          await delay(3000);
          await printDocument(attendee.attendee_id);
          // Ne pas vérifier printStatus ici ; la logique est gérée par useEffect ci-dessous
        } else {
          resetScanner();
          navigation.navigate('Attendees');
        }
      } else {
        setScanStatus('not_found');
        await delay(3000);
        resetScanner();
      }
    } catch (error) {
      console.error('Error during scanning:', error);
      setModalVisible(true);
      setScanStatus('error');
      await delay(3000);
      resetScanner();
    }
  };

  // Réagir aux changements de printStatus et scanStatus
  useEffect(() => {
    if (scanStatus === 'printing') {
      console.log(`Current printStatus: ${printStatus}`);
      if (printStatus === 'Print successful') {
        console.log('Print was successful.');
        setScanStatus('Print successful');
        // Garder le modal ouvert pour afficher le succès
        setTimeout(() => {
          resetScanner();
          navigation.navigate('Attendees');
        }, 2000); // 2 secondes pour afficher le message
      } else if (printStatus === 'Error printing') {
        console.log('Print encountered an error.');
        setScanStatus('Error printing');
        console.error('Printing failed, staying on the screen.');
        // Garder le modal ouvert pour afficher l'erreur
        setTimeout(() => {
          resetScanner();
        }, 2000); // 2 secondes pour afficher le message d'erreur
      }
    }
  }, [printStatus, scanStatus, navigation]);

  // Gestion de la fermeture du modal
  const handleModalClose = () => {
    resetScanner();
    triggerListRefresh();
  };

  // Définition correcte de handleBackPress à l'intérieur du composant
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        title="Scan QR Code"
        color={colors.greyCream}
        handlePress={handleBackPress}
        backgroundColor={undefined}
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
        <View style={styles.overlay}>
          <CustomMarker
            markerColor={markerColor}
            isScanning={scanStatus !== 'idle'}
            scanAnimation={scanAnimation}
          />
          {(scanStatus === 'not_found' || scanStatus === 'found') && (
            <View
              style={[
                styles.popupContainer,
                {
                  backgroundColor:
                    scanStatus === 'not_found' ? colors.red : colors.green,
                },
              ]}>
              <Text style={styles.popupText}>
                {scanStatus === 'not_found' ? 'Not found' : attendeeData?.name}
              </Text>
            </View>
          )}
        </View>
      </RNCamera>
      <ScanModal
        visible={modalVisible}
        onClose={handleModalClose}
        status={scanStatus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupContainer: {
    backgroundColor: 'red',
    padding: 10,
    paddingHorizontal: 50,
    zIndex: 100,
    position: 'absolute',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupText: {
    color: 'white',
  },
});

export default ScanComponent;
