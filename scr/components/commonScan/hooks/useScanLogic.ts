import { useState, useRef } from 'react';
import { handleScan } from '../utils/handleScan';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { useAddComment } from '../../../hooks/edit/useAddComment';
import { useFetchAttendeeCounts } from '../../../hooks/attendee/useFetchAttendeeCounts';
import useSessionRegistrationData from '../../../hooks/registration/useSessionRegistrationSData';
import { ScanType } from '../types/scan';
import { useActiveEvent } from '../../../utils/event/useActiveEvent';
import { selectCurrentUserId } from '../../../redux/selectors/auth/authSelectors';
import usePrintDocument from '../../../hooks/print/usePrintDocument';
import { usePrintStatus } from '../../../printing/context/PrintStatusContext';


export const useScanLogic = (scanType: ScanType, userId: string) => {
  const hasScanned = useRef(false);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeData, setAttendeeData] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const { eventId } = useActiveEvent();
  const { capacity, totalCheckedIn, loading : statsLoading } = useSessionRegistrationData({ refreshTrigger1: refreshTrigger });
  const { partnerCount, childSessionCount, loading, fetchCounts } = useFetchAttendeeCounts();
  const { setStatus } = usePrintStatus();

  const { submitComment, loading: addingComment, error: addCommentError, resetError: resetAddError } = useAddComment();

  const {printDocument} = usePrintDocument();

  const resetScanner = () => {
    setAttendeeName('');
    setAttendeeData(null);
    setScanStatus('idle');
    setModalVisible(false);
    setComment('');
    hasScanned.current = false;
  };

  const onBarCodeRead = async ({ data }) => {
    if (hasScanned.current) return;
    hasScanned.current = true;

    await handleScan({
      data,
      scanType,
      userId,
      eventId,
      setAttendeeData,
      setAttendeeName,
      setScanStatus,
      afterSuccess: async (attendee) => {
        switch (scanType) {
          case ScanType.Partner:
            await fetchCounts(attendee.attendee_id);
            await new Promise(res => setTimeout(res, 1000));
            setModalVisible(true);
            break;
          case ScanType.Session:
            Toast.show({
              type: 'customSuccess',
              text1: attendee.attendee_name,
              text2: 'a bien été enregistré',
            });
            setRefreshTrigger(prev => prev + 1);
            break;
            case ScanType.Main:

                if (isButtonActive) {
                  setModalVisible(true);
                } else {
                  setStatus('checkin_success');
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  await printDocument(attendee.badge_pdf_url); 
                  setRefreshTrigger(prev => prev + 1);
                }
            break;
              
        }
        setTimeout(() => {
            hasScanned.current = false;
            // Ne reset que si ce n’est pas un partner, et pas un main avec bouton actif
            const shouldReset =
              scanType === ScanType.Partner ? false :
              scanType === ScanType.Main && isButtonActive ? false :
              true;
          
            if (shouldReset) resetScanner();
          }, 1500);
          
      },
      afterFailure: async () => {
        setTimeout(() => {
          hasScanned.current = false;
          resetScanner();
        }, 2000);
      },
    });
  };

  return {
    attendeeName,
    attendeeData,
    scanStatus,
    modalVisible,
    comment,
    setComment,
    showSuccess,
    setShowSuccess,
    isButtonActive,
    setIsButtonActive,
    setModalVisible,
    onBarCodeRead,
    resetScanner,
    capacity,
    totalCheckedIn,
    partnerCount,
    childSessionCount,
    loading,
    addingComment,
    addCommentError,
    resetAddError,
    submitComment,
  };
};
