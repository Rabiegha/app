// SessionsScanScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
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
import DetailsModal from './detailsModal';
import {useFetchAttendeeCounts} from '../../hooks/attendee/useFetchAttendeeCounts';
import { useFocusEffect } from '@react-navigation/native';


const MainScanScreen = () => {

  useFocusEffect(
    React.useCallback(() => {
      // Screen focused
      console.log('Scan screen focused');
      hasScanned.current = false;
  
      return () => {
        // Screen unfocused: cleanup
        console.log('Scan screen unfocused — cleaning up');
        resetScanner();
        hasScanned.current = false;
      };
    }, [])
  );
  
    const cameraRef = useRef<RNCamera>(null);
    const userId = useSelector(selectCurrentUserId);
    const { eventId } = useActiveEvent();
    const [attendeeData, setAttendeeData] = useState(null);
    const [attendeeName, setAttendeeName] = useState('');
    const [scanStatus, setScanStatus] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    const navigation = useNavigation();
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const goBack = () => {
        navigation.goBack();
      };

    const resetScanner = () => {
      setAttendeeData(null);
      setModalVisible(false);
      setScanStatus('idle');
      hasScanned.current = false;
    };

    const hasScanned = useRef(false);


    const { partnerCount, childSessionCount, loading, fetchCounts } = useFetchAttendeeCounts();
    


    const onBarCodeRead = async ({data}) => {
      console.log('API data:', data);

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
              await fetchCounts(attendee?.attendee_id);

              await delay(1000);
      
              setModalVisible(true);
              
            } else {
                setScanStatus('not_found');
                
                setTimeout(() => {  
                  hasScanned.current = false;
                  resetScanner();
                }, 2000);  
              }
        } catch (error) {
            console.error('Error during scanning:', error);
            setScanStatus('not_found');
            
            setTimeout(() => {  
              resetScanner();
              hasScanned.current = false;
            }, 2000);  
        } finally {
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
            mainPopupContent={
                <>
                <DetailsModal
                  visible={modalVisible}
                  onRequestClose={resetScanner}
                  onProfilePress={() => {
                    setModalVisible(false);
                    navigation.navigate('More');
                  } }
                  sessionCount={childSessionCount}
                  partnerCount={partnerCount} 
                  attendeeName={attendeeName}
                  loading={loading}
                  onRetry={resetScanner} />
                </>
            } />
    </View>
    )
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default MainScanScreen;
