import { useState, useRef, useEffect, useCallback } from 'react';
import { handleScan } from '../utils/handleScan';
import Toast from 'react-native-toast-message';
import { useAddComment } from '../../../hooks/edit/useAddComment';
import { useFetchAttendeeCounts } from '../../../hooks/attendee/useFetchAttendeeCounts';
import useSessionRegistrationData from '../../../hooks/registration/useSessionRegistrationSData';
import { ScanType } from '../types/scan';
import { useActiveEvent } from '../../../utils/event/useActiveEvent';
import usePrintDocument from '../../../printing/hooks/usePrintDocument';
import { usePrintStatus } from '../../../printing/context/PrintStatusContext';
import { fetchAttendeesList } from '../../../services/getAttendeesListService';


export const useScanLogic = (scanType: ScanType, userId: string) => {
  // State for tracking scan status and preventing duplicates
  const hasScanned = useRef(false);
  const recentScans = useRef<{[key: string]: number}>({});
  
  // UI state
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeData, setAttendeeData] = useState(null);
  const [scanStatus, setScanStatus] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGiftModeActive, setIsGiftModeActive] = useState(false);
  const [isPrintModeActive, setIsPrintModeActive] = useState(false);

  // External hooks
  const { eventId } = useActiveEvent();
  const { capacity, totalCheckedIn, loading: statsLoading } = useSessionRegistrationData({ refreshTrigger1: refreshTrigger });
  const { partnerCount, childSessionCount, loading, fetchCounts } = useFetchAttendeeCounts();
  const { setStatus } = usePrintStatus();
  const { submitComment, loading: addingComment, error: addCommentError, resetError: resetAddError } = useAddComment();
  const { printDocument } = usePrintDocument();


  // Reset scanner state - optimized with useCallback to prevent unnecessary re-renders
  const resetScanner = useCallback(() => {
    setAttendeeName('');
    setAttendeeData(null);
    setScanStatus('idle');
    setModalVisible(false);
    setComment('');
    hasScanned.current = false;
  }, []);

  // Clean up function to reset scanner state when component unmounts
  useEffect(() => {
    // Cleanup old scans periodically to prevent memory leaks
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const updatedScans = { ...recentScans.current };
      
      // Remove entries older than 10 minutes
      Object.keys(updatedScans).forEach(code => {
        if (now - updatedScans[code] > 10 * 60 * 1000) {
          delete updatedScans[code];
        }
      });
      
      recentScans.current = updatedScans;
    }, 60000); // Clean up every minute
    
    return () => {
      clearInterval(cleanupInterval);
      resetScanner();
      // Clear the recent scans tracking
      recentScans.current = {};
    };
  }, [resetScanner]);


  // Optimized barcode read handler with debounce protection
  const onBarCodeRead = useCallback(async ({ data }) => {
    // Prevent processing if already scanning or if data is empty
    if (hasScanned.current || !data) return;
    
    // Check if this QR code was recently scanned - prevent duplicate scans
    const now = Date.now();
    const lastScanTime = recentScans.current[data] || 0;
    
    // Check if this is the same QR code that was scanned recently
    const isSameQrCode = data in recentScans.current;
    const timeSinceLastScan = now - lastScanTime;
    
    if (isSameQrCode) {
      // For the same QR code, enforce a cooldown period
      // This makes scanning the same QR code slow
      const sameScanCooldown = scanType === ScanType.Session ? 2000 : 5000;
      
      if (timeSinceLastScan < sameScanCooldown) {
        console.log('Preventing duplicate scan of the same QR code');
        return;
      }
    } else {
      // For different QR codes, allow immediate scanning
      // This makes scanning different QR codes fast
      console.log('New QR code detected, allowing immediate scan');
    }
    
    // Mark this code as recently scanned
    recentScans.current[data] = now;
    
    // Set scanning flag
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
        // For session scans, we don't show the found modal at all
        // This prevents the jarring effect of a quick modal appearance
        if (scanType === ScanType.Session) {
          // Skip setting scan status for session scans
          // The toast notification provides enough feedback
        } else {
          // For other scan types, show the found status with a smooth transition
          // First delay slightly to make the transition feel more natural
          await new Promise(res => setTimeout(res, 100));
          setScanStatus('found');
          
          // Keep the status visible for a reasonable time
          setTimeout(() => setScanStatus('idle'), 2000);
        }
        
        switch (scanType) {
          case ScanType.Partner:
            await new Promise(res => setTimeout(res, 1000));
            setModalVisible(true);
            break;
          case ScanType.Session:
            // For session scans, we want immediate feedback without modal flicker
            // Show toast notification immediately
            Toast.show({
              type: 'customSuccess',
              text1: attendee.attendee_name,
              text2: 'a bien été enregistré',
            });
            
            // Update the refresh trigger for stats
            setRefreshTrigger(prev => prev + 1);
            
            // Use a moderate delay before resetting to allow for the next scan
            // This provides a good balance between preventing duplicates and allowing fast scanning
            setTimeout(() => {
              resetScanner();
            }, 1500);
            break;
            case ScanType.Main:

                if (isGiftModeActive) {
                  await fetchCounts(attendee?.attendee_id);
                  await new Promise(res => setTimeout(res, 1000));
                  setModalVisible(true);
                } else {
                  if (isPrintModeActive) {
                    setStatus('checkin_success');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setStatus('printing');
                    
                    // Short delay before fetching badge details
                    await new Promise(resolve => setTimeout(resolve, 250));
                    
                    // Fetch attendee details to get badge URL
                    const [details] = await fetchAttendeesList(userId, eventId, attendee.attendee_id);
                    const badgeUrl = details?.badge_pdf_url || '';
                    console.log('Badge URL for printing:', badgeUrl);
                    
                    if (!badgeUrl) {
                      console.error('No badge URL available for printing');
                      setStatus('file_not_found');
                    } else {
                      // Print the badge
                      await printDocument(badgeUrl, undefined, true);  
                    }
                  } else {
                    Toast.show({
                      type: 'customSuccess',
                      text1: attendee.attendee_name,
                      text2: 'a bien été enregistré',
                    });
                  }
                  setRefreshTrigger(prev => prev + 1);
                  // For main scan type (no gift or print mode), use a moderate reset delay
                  // This allows fast scanning of different QR codes while preventing duplicates
                  setTimeout(() => {
                    resetScanner();
                  }, 1200);
                }
            break;
        }

      },
      afterFailure: async () => {
        setScanStatus('not_found');
        setTimeout(() => {
          hasScanned.current = false;
          resetScanner();
        }, 2000);
      },
    });
  }, [userId, eventId, scanType, isGiftModeActive, isPrintModeActive, 
      fetchCounts, setStatus, printDocument, resetScanner, setAttendeeName, 
      setAttendeeData, setScanStatus, setModalVisible, setRefreshTrigger]);

  // Function to force reset the scanner state - can be called when navigating away
  const forceResetScanState = useCallback(() => {
    hasScanned.current = false;
    resetScanner();
    // Clear the recent scans tracking
    recentScans.current = {};
  }, [resetScanner]);

  return {
    attendeeName,
    attendeeData,
    scanStatus,
    modalVisible,
    comment,
    setComment,
    showSuccess,
    setShowSuccess,
    isGiftModeActive,
    setIsGiftModeActive,
    isPrintModeActive,
    setIsPrintModeActive,
    setModalVisible,
    onBarCodeRead,
    resetScanner,
    capacity,
    totalCheckedIn,
    statsLoading,
    partnerCount,
    childSessionCount,
    loading,
    addingComment,
    addCommentError,
    resetAddError,
    submitComment,
    forceResetScanState,
  };
};
