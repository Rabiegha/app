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

export const useScanLogic = (scanType: ScanType) => {
  const hasScanned = useRef(false);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeData, setAttendeeData] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isButtonActive, setIsButtonActive] = useState(false);

  const userId = useSelector(selectCurrentUserId);
  const { eventId } = useActiveEvent();
  const { capacity, totalCheckedIn } = useSessionRegistrationData({ refreshTrigger1: refreshTrigger });
  const { partnerCount, childSessionCount, loading, fetchCounts } = useFetchAttendeeCounts();

  const { submitComment, loading: addingComment, error: addCommentError, resetError: resetAddError } = useAddComment();

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
            setModalVisible(true);
            break;
        }

        setTimeout(() => {
          hasScanned.current = false;
          if (scanType !== ScanType.Partner) resetScanner();
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
