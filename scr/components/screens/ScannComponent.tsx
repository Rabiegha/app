import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../../colors/colors';
import {EventProvider, useEvent} from '../../context/EventContext';
import CustomMarker from '../elements/CustomMarker';
import ScanModal from '../modals/ScanModal';
import {scanAttendee} from '../../services/serviceApi';
import usePrintDocument from '../../hooks/usePrintDocument';
import useUserId from '../../hooks/useUserId';

const ScannerComponent = () => {
  const navigation = useNavigation();
  const {triggerListRefresh, eventId} = useEvent();
  const cameraRef = useRef(null);
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const [markerColor, setMarkerColor] = useState('white');
  const [modalVisible, setModalVisible] = useState(false);
  const [attendeeData, setAttendeeData] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle');

  const {userId} = useUserId();
  const {printDocument} = usePrintDocument();

  // Handle the back press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Reset modal visibility on screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setModalVisible(false);
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

    try {
      const response = await scanAttendee(userId, eventId, data);
      console.log('API Response:', response);

      await delay(1000);
      if (response.status === true) {
        const attendee = response.attendee_details;
        setAttendeeData({
          id: attendee.attendee_id,
          name: attendee.attendee_name,
        });
        setScanStatus('found');
        await delay(1000);
        setModalVisible(true);
        setScanStatus('approved');
        triggerListRefresh();

        await delay(2000);
        setScanStatus('printing');
        await printDocument(attendee.attendee_id);

        await delay(3000);
        resetScanner();
        navigation.navigate('Attendees');
      } else {
        setScanStatus('not_found');

        await delay(3000);
        resetScanner();
      }
    } catch (error) {
      // Network or other errors
      console.error('Error during scanning:', error);
      setModalVisible(true);
      setScanStatus('error');
      await delay(3000);
      resetScanner();
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
    triggerListRefresh();
  };

  return (
    <EventProvider>
      <View style={styles.container}>
        <HeaderComponent
          title="Scan QR Code"
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
                      scanStatus === 'not_found' ? colors.red : colors.green, // Dynamic background color
                  },
                ]}>
                <Text style={styles.popupText}>
                  {scanStatus === 'not_found' ? 'Not found' : attendeeData.name}
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
    </EventProvider>
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

export default ScannerComponent;
