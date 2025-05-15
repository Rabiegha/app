// SessionsScanScreen.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scanAttendee } from '../../services/scanAttendeeService';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import SessionStats from '../../components/screens/sessionAttendeeList/SessionStatsComponent';
import useSessionRegistrationData from '../../hooks/registration/useSessionRegistrationSData';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import colors from '../../assets/colors/colors';
import MainScanComponent from '../../components/screens/mainScan/MainScanComponent';
import { RNCamera } from 'react-native-camera';
import Toast from 'react-native-toast-message';


const SessionScanScreen = () => {
  const cameraRef = useRef<RNCamera>(null);



    const userId = useSelector(selectCurrentUserId);
    const { eventId } = useActiveEvent();
    const [attendeeData, setAttendeeData] = useState(null);
    const [attendeeName, setAttendeeName] = useState('');
    const [scanStatus, setScanStatus] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {capacity, totalCheckedIn} = useSessionRegistrationData({ refreshTrigger1: refreshTrigger });
    const ratio = capacity > 0 ? (totalCheckedIn / capacity) * 100 : 0;


    const navigation = useNavigation();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const goBack = () => {
        navigation.goBack();
      };

      const resetScanner = () => {
        setAttendeeData(null);
        setScanStatus('idle');
      };

      const hasScanned = useRef(false);

    const onBarCodeRead = async ({data}) => {

      if (hasScanned.current) return; // Évite les scans multiples
      hasScanned.current = true;

        try {
            const response = await scanAttendee(userId, eventId, data);
            console.log('API Response:', response);
            if (response.status === true) {
              const attendee = response.attendee_details;
              setAttendeeData({
                id: attendee?.attendee_id || 'N/A',  // Default fallback
                name: attendee?.attendee_name || 'Unknown Attendee',
              });

              setAttendeeName(attendee?.attendee_name || 'Unknown');
              setScanStatus('found');
              Toast.show({
                type: 'customSuccess',
                text1: attendee?.attendee_name || 'Scan réussi',
                text2: 'a bien été enregistré',
              });
              await setRefreshTrigger(p => p + 1);
            } else {
                setScanStatus('not_found');
              }
        } catch (error) {
            console.error('Error during scanning:', error);
            setScanStatus('not_found');
        } finally {
          setTimeout(() => {
            resetScanner();              
            hasScanned.current = false; 
          }, 1000);  
        }
        
    }

    return (
    <View style={styles.container}>
        <MainScanComponent
            ref={cameraRef} 
            onBarCodeRead={onBarCodeRead}
            goBack={goBack}
            attendeeName={attendeeName}
            scanStatus={scanStatus}
            popupContent={
                <>
                <SessionStats scannedCount={totalCheckedIn} totalCount={capacity} color={colors.greyCream} />
                <ProgressBar progress={ratio} />
                </>
            } />
    </View>
    )
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default SessionScanScreen;
