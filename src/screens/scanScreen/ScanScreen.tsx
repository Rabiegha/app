import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { RouteProp, useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import SessionStats from '../../components/screens/sessionAttendeeList/SessionStatsComponent';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import { getModalByScanType } from '../../components/commonScan/utils/getModalByScanType';
import { useScanLogic } from '../../components/commonScan/hooks/useScanLogic';
import { ScanType } from '../../components/commonScan/types/scan';
import { ActivityIndicator } from 'react-native';
import { RootStackParamList } from '../../types/navigation.types';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';
import MainScanComponent from '../../components/commonScan/MainScanComponent';




type Props = {
    scanType?: ScanType;
  };

  
const ScanScreen = ({scanType: propScanType}: Props) => {

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    
    // Enhanced focus effect to properly reset scanner state
    useFocusEffect(
        useCallback(() => {
          // When screen gains focus
          scan.resetScanner();
          
          // Handle back button press to ensure proper cleanup
          const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (isFocused) {
              scan.forceResetScanState();
              navigation.goBack();
              return true;
            }
            return false;
          });
          
          return () => {
            // When screen loses focus
            scan.forceResetScanState(); // Use our enhanced reset function
            backHandler.remove();
          };
        }, [isFocused])
      );
      
    // Additional effect to handle navigation events
    useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        // Ensure scan state is reset before navigation
        scan.forceResetScanState();
      });
      
      return unsubscribe;
    }, [navigation]);
      

  const cameraRef = useRef<RNCamera>(null);
  // navigation is already defined above
  const route = useRoute<RouteProp<RootStackParamList, 'ScanScreen'>>();
  const scanType = propScanType || route.params?.scanType || ScanType.Main;  
  const userId = useSelector(selectCurrentUserId);
  const { status: printStatus, clearStatus } = usePrintStatus();

  const scan = useScanLogic(scanType, userId);

  const sessionScanStats =
    scanType === ScanType.Session ? (
      <>
        <SessionStats
          scannedCount={scan.totalCheckedIn}
          totalCount={scan.capacity}
          color={'#eee'}
        />
        <ProgressBar
          progress={
            scan.capacity > 0
              ? (scan.totalCheckedIn / scan.capacity) * 100
              : 0
          }
        />
      </>
    ) : null;

  const modal = getModalByScanType({
    scanType,
    isGiftModeActive: scan.isGiftModeActive,
    props: {
      visible: scan.modalVisible,
      onRequestClose: scan.resetScanner,
      onClose: scan.resetScanner,
      attendeeName: scan.attendeeName,
      attendeeData: scan.attendeeData,
      comment: scan.comment,
      setComment: scan.setComment,
      loading: scan.loading || scan.addingComment,
      error: scan.addCommentError,
      onRetry: scan.resetAddError,
      showSuccess: scan.showSuccess,
      onAddPress: async () => {
        const success = await scan.submitComment({
          userId: userId,
          attendeeId: scan.attendeeData?.id,
          comment: scan.comment,
        });
        if (success) {
          scan.setShowSuccess(true);
          setTimeout(() => {
            scan.setShowSuccess(false);
            scan.resetScanner();
          }, 1500);
        }
      },
      sessionCount: scan.childSessionCount,
      partnerCount: scan.partnerCount,
      status: printStatus,
      onClosePrintModal: clearStatus,
    },
  });

  return (
    <View style={styles.container}>
      <MainScanComponent
        ref={cameraRef}
        onBarCodeRead={scan.onBarCodeRead}
        goBack={() => {
          scan.forceResetScanState();
          navigation.goBack();
        }}
        attendeeName={scan.attendeeName}
        scanStatus={scan.scanStatus}
        sessionScanStats={sessionScanStats}
        mainPopupContent={modal}
        isButtonShown={scanType === ScanType.Main}
        isGiftModeActive={scan.isGiftModeActive}
        isPrintModeActive={scan.isPrintModeActive}
        handleGiftButtonPress={() => {
          scan.setIsGiftModeActive(!scan.isGiftModeActive);
          // logique personnalisée ici
        }}
        handlePrintButtonPress={() => {
          scan.setIsPrintModeActive(!scan.isPrintModeActive);
          // logique personnalisée ici
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ScanScreen;
