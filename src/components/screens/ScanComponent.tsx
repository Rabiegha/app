// src/components/ScannerComponent.ts

import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';
import colors from '../../assets/colors/colors';
import {useEvent} from '../../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import ScanModal from '../elements/modals/ScanModal';
import {scanAttendee} from '../../services/scanAttendeeService';
import usePrintDocument from '../../printing/hooks/usePrintDocument';
import {useSelector} from 'react-redux';
import {
  selectPrintStatus,
  selectAutoPrint,
} from '../../redux/selectors/print/printerSelectors';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';
import { useFocusEffect } from '@react-navigation/native';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import MainHeader from '../elements/header/MainHeader';

const ScanComponent = () => {
  const navigation = useNavigation();
  const {triggerListRefresh } = useEvent();
  const { eventId } = useActiveEvent();
  const cameraRef = useRef(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const [markerColor] = useState('white');
  const [modalVisible, setModalVisible] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle');
  const {
    sessionDetails,
  } = useEvent();
  const isSession = sessionDetails !== null;

  const userId = useSelector(selectCurrentUserId);

  const selectedNodePrinter = useSelector((state: any) => state.printers.selectedNodePrinter);
  const nodePrinterId = selectedNodePrinter?.id;

  const {printDocument} = usePrintDocument();

  const printStatus = useSelector(selectPrintStatus);
  const autoPrint = useSelector(selectAutoPrint);

  useEffect(() => {
    const nodePrinterId = selectedNodePrinter?.id;
    console.log(
      'Updated selectedNodePrinter in ScannerComponent:',
      nodePrinterId,
    );
  }, [selectedNodePrinter]);

  //Remplacer ça:

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetScanner();
    });
    console.log('isSession', isSession)
    return unsubscribe;
  }, [navigation]);

  //Par ça:

/*   import { useFocusEffect } from '@react-navigation/native';

      useFocusEffect(
        React.useCallback(() => {
          resetScanner();
        }, [])
      ); */


  const resetScanner = () => {
    setAttendeeData(null);
    setModalVisible(false);
    setScanStatus('idle');
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const hasScanned = useRef(false);

  const onBarCodeRead = async ({data}) => {

    if (hasScanned.current) return; // Évite les scans multiples
    hasScanned.current = true;

    console.log("🔍 Scanned Data:", data)
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
          id: attendee?.attendee_id || 'N/A',  // Default fallback
          name: attendee?.attendee_name || 'Unknown Attendee',
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
          /* navigation.navigate('Attendees'); */
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

      // Autorise un nouveau scan après 3 secondes
    setTimeout(() => {
    hasScanned.current = false;
  }, 2000);
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
          navigation.navigate('AttendeesList');
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

  const headerStyles = isSession
  ? {
      backgroundColor: colors.cyan,
      color: colors.greyCream,
      leftButtonTintColor: colors.greyCream,
    }
  : {
      backgroundColor: 'white',
      color: colors.darkGrey,
      leftButtonTintColor: colors.green,
    };

  return (
    <View style={styles.container}>
      <MainHeader
        title="Scan QR Code"
        onLeftPress={handleBackPress}
        backgroundColor={headerStyles.backgroundColor}
        color={headerStyles.color}
        leftButtonTintColor={headerStyles.leftButtonTintColor}
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
