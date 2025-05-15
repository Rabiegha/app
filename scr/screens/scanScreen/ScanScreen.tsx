import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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

    useFocusEffect(
        useCallback(() => {
          // Quand l'écran est focus
          scan.resetScanner();
          return () => {
            // Quand on quitte l'écran (optionnel)
            scan.resetScanner(); // utile aussi ici pour éviter les conflits
          };
        }, [])
      );
      

  const cameraRef = useRef<RNCamera>(null);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ScanScreen'>>();
  const scanType = propScanType || route.params?.scanType || ScanType.Main;  
  const userId = useSelector(selectCurrentUserId);
  const { status: printStatus, clearStatus } = usePrintStatus();

  const scan = useScanLogic(scanType, userId);

  const sessionScanStats =
    scanType === ScanType.Session ? (
        scan.statsLoading ? (
            <ActivityIndicator size="small" color="#999" style={{ marginTop: 20 }} />
          ) : (
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
          )
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
        goBack={navigation.goBack}
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
