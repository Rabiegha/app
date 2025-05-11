import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import MainScanComponent from '../../components/screens/mainScan/MainScanComponent';
import SessionStats from '../../components/screens/sessionAttendeeList/SessionStatsComponent';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import { getModalByScanType } from '../../components/commonScan/utils/getModalByScanType';
import { useScanLogic } from '../../components/commonScan/hooks/useScanLogic';
import { ScanType } from '../../components/commonScan/types/scan';


type Props = {
    scanType?: ScanType;
  };

  
const ScanScreen = ({scanType: propScanType}: Props) => {
  const cameraRef = useRef<RNCamera>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const routeScanType = route.params?.scanType as ScanType | undefined;
  const scanType = propScanType || routeScanType || ScanType.Main;

  const scan = useScanLogic(scanType);

  const sessionScanStats =
    scanType === ScanType.Session ? (
      <>
        <SessionStats scannedCount={scan.totalCheckedIn} totalCount={scan.capacity} color={'#eee'} />
        <ProgressBar progress={scan.capacity > 0 ? (scan.totalCheckedIn / scan.capacity) * 100 : 0} />
      </>
    ) : null;

  const modal = getModalByScanType({
    scanType,
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
          userId: '', // optionnel si géré ailleurs
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
        isButtonActive={scan.isButtonActive}
        handleButtonPress={() => {
          scan.setIsButtonActive(!scan.isButtonActive);
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
