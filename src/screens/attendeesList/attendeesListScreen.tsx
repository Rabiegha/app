import React, { useRef, useState } from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import MainAttendeeListItem, { ListHandle } from '../../components/screens/attendees/mainAttendeeList/MainAttendeeList';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import ProgressText from '../../components/elements/progress/ProgressionText';
import MainHeader from '../../components/elements/header/MainHeader';
import { useEvent } from '../../context/EventContext';
import Search from '../../components/elements/Search';
import FiltreComponent from '../../components/filtre/FiltreComponent';
import { useAppDispatch, RootState } from '../../redux/store';
import { updateAttendeeLocally } from '../../redux/slices/attendee/attendeeSlice';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import CheckinPrintModal from '../../components/elements/modals/CheckinPrintModal';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import Icons from '../../assets/images/icons';
import colors from '../../assets/colors/colors';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';
import usePrintDocument from '../../printing/hooks/usePrintDocument';
import { Attendee } from '../../types/attendee.types';
import { useAttendee } from '../../hooks/attendee/useAttendee';

const defaultFilterCriteria = {
  status: 'all',
  company: null,
};

const AttendeeListScreen = () => {
  const listRef = useRef<ListHandle>(null);
  const { eventName, eventId } = useEvent();
  const userId = useSelector(selectCurrentUserId);
  
  // State management
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState<Animated.Value>(new Animated.Value(-300));
  const [filterCriteria, setFilterCriteria] = useState(defaultFilterCriteria);
  
  // Redux and API related hooks
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { printDocument } = usePrintDocument();
  const { status: printStatus, clearStatus, setStatus } = usePrintStatus();
  const { updateAttendeeStatus } = useAttendee();
  
  // Attendee data from Redux
  const { list: allAttendees } = useSelector((state: RootState) => state.attendee);
  
  // Registration data for stats
  const { totalAttendees, totalCheckedIn, totalNotCheckedIn, ratio, summary } = useRegistrationData({ refreshTrigger1: refreshTrigger });
  
  
  // Direct refresh trigger for the child component
  const triggerChildRefresh = () => {
    listRef.current?.handleRefresh();
  };


  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const clearSearch = () => {
    if (searchQuery !== '') {
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  // Handle check-in functionality
  const handleCheckIn = async (attendeeId: string, status: 0 | 1) => {
    if (!userId || !eventId || !attendeeId) {
      console.error('Missing required parameters for check-in');
      return false;
    }

    try {
      // Update the attendee status
      const success = await updateAttendeeStatus({
        userId,
        eventId: eventId as string,
        attendeeId,
        status
      }).catch((error: Error) => {
        console.error('API call failed:', error);
        return false;
      });
      
      if (success) {
        // Refresh data after successful update
        setRefreshTrigger(p => p + 1);
        return true; // Indicate success
      } else {
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Error during check-in process:', error);
      return false; // Indicate failure
    }
  };
  
  // Handle attendee updates
  const handleUpdateAttendee = async (updatedAttendee: Attendee) => {
    // Store original attendee state to revert if needed
    const originalAttendee = allAttendees.find((a: Attendee) => a.id === updatedAttendee.id);
    if (!originalAttendee) {
      console.error('Cannot find original attendee to update');
      return false;
    }
    
    try {
      // Update locally first for immediate UI feedback
      dispatch(updateAttendeeLocally({
        ...updatedAttendee,
        attendee_status: updatedAttendee.attendee_status
      }));
      
      // Then update on the server
      const success = await handleCheckIn(
        updatedAttendee.id.toString(),
        updatedAttendee.attendee_status
      );
      
      if (!success) {
        // If server update failed, revert local changes
        dispatch(updateAttendeeLocally(originalAttendee));
        
        // Show error to user
        console.error('Failed to update attendee status on server');
      }
      
      return success; // Indicate success or failure
    } catch (error) {
      console.error('Error updating attendee:', error);
      
      // Revert local changes on error
      dispatch(updateAttendeeLocally(originalAttendee));
      
      return false; // Indicate failure
    }
  };
  
  // Handle print and check-in action
  const handlePrintAndCheckIn = async (attendee: Attendee) => {
    // Store original attendee state to revert if needed
    const originalAttendee = { ...attendee };
    
    try {
      // First update Redux store locally for immediate UI feedback
      dispatch(updateAttendeeLocally({
        ...attendee,
        attendee_status: 1 as const
      }));
      
      // Show success notification immediately
      setStatus('checkin_success');
      
      // Print badge if available
      let printSuccess = false;
      if (attendee.badge_pdf_url && 
          typeof attendee.badge_pdf_url === 'string' && 
          attendee.badge_pdf_url.trim() !== '') {
        try {
          // Print the badge right away
          await printDocument(attendee.badge_pdf_url, undefined, true);
          printSuccess = true;
        } catch (printError) {
          console.error('Error printing badge:', printError);
          setStatus('unknown_error');
        }
      } else {
        console.error('Badge PDF URL is empty or invalid:', attendee.badge_pdf_url);
        setStatus('file_not_found');
      }
      
      // Then update on the server
      try {
        const apiSuccess = await handleCheckIn(attendee.id.toString(), 1);
        
        if (!apiSuccess) {
          // If server update failed but printing succeeded, inform the user
          // but don't revert the UI state to avoid confusion
          if (printSuccess) {
            console.warn('Badge printed successfully, but server update failed. The attendee will need to be checked in again when online.');
          } else {
            // If neither printing nor server update succeeded, revert the local state
            dispatch(updateAttendeeLocally(originalAttendee));
            setStatus('unknown_error');
          }
        }
      } catch (apiError) {
        console.error('Error updating attendee on server:', apiError);
        // Don't revert if printing was successful to avoid confusion
        if (!printSuccess) {
          dispatch(updateAttendeeLocally(originalAttendee));
          setStatus('unknown_error');
        }
      }
    } catch (error) {
      console.error('Error while printing and checking in:', error);
      // Revert local changes
      dispatch(updateAttendeeLocally(originalAttendee));
      setStatus('unknown_error');
    }
  };
  
  // Handle toggle check-in status
  const handleToggleCheckIn = async (attendee: Attendee) => {
    // Toggle attendee status
    const newStatus = attendee.attendee_status === 0 ? (1 as const) : (0 as const);
    // Store original status for reverting if needed
    const originalStatus = attendee.attendee_status;
    
    // Update locally first for immediate UI feedback
    dispatch(updateAttendeeLocally({
      ...attendee,
      attendee_status: newStatus
    }));
    
    // Update in API
    const success = await handleCheckIn(attendee.id.toString(), newStatus);
    
    if (success) {
      // Only show success message when changing from not checked-in to checked-in
      if (originalStatus === 0 && newStatus === 1) {
        setStatus('checkin_success');
        
        // Reset status after 2 seconds
        setTimeout(() => {
          if (setStatus) setStatus(null);
        }, 2000);
      }
    } else {
      // Revert local changes if API update failed
      dispatch(updateAttendeeLocally({
        ...attendee,
        attendee_status: originalStatus
      }));
      setStatus('unknown_error');
    }
  };
  
  // Trigger refresh for child components
  const handleTriggerRefresh = () => {
    setRefreshTrigger(p => p + 1);
  };

  const handleLeftPress = () => {
    if (filterCriteria.status === 'all' && !filterCriteria.company) {
      clearSearch();
    } else {
      setFilterCriteria(defaultFilterCriteria);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>

      <View style={{ flex: 1 }}>
          <MainHeader
            onLeftPress={handleLeftPress}
            onRightPress={openModal}
            RightIcon={Icons.Filtre}
            title={eventName}
          />
        <View style={[styles.mainContent,     {
          paddingTop: 35,
        },]}>
            <Search onChange={setSearchQuery} value={searchQuery} />
            <ProgressText totalCheckedAttendees={totalCheckedIn} totalAttendees={totalAttendees} />
            <ProgressBar progress={ratio} />



                {/* 🔁 Bouton de reload */}
            <TouchableOpacity style={styles.imageContainee} onPress={triggerChildRefresh}>
              <Image style={styles.reloadImage} source={Icons.refresh} />
            </TouchableOpacity>
            {/* 📋 Liste des participants */}

              <MainAttendeeListItem
                ref={listRef}
                searchQuery={searchQuery}
                onShowNotification={() => {
                  setStatus('checkin_success');
                  // Reset status after 2 seconds
                  setTimeout(() => {
                    if (setStatus) setStatus(null);
                  }, 2000);
                }}
                filterCriteria={filterCriteria}
                onTriggerRefresh={handleTriggerRefresh}
                summary={summary}
                // Pass down the business logic handlers
                onUpdateAttendee={async (attendee) => {
                await handleUpdateAttendee(attendee);
              }}
              onPrintAndCheckIn={handlePrintAndCheckIn}
              onToggleCheckIn={handleToggleCheckIn}
              />


            {/* 🧾 Modal de filtre */}
            <Modal animationType="none" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
              <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={closeModal}>
                <TouchableWithoutFeedback>
                  <Animated.View style={[styles.modalView, { transform: [{ translateX: modalAnimation }] }]}>
                    <FiltreComponent
                      initialFilter={filterCriteria}
                      defaultFilter={defaultFilterCriteria}
                      onApply={(newFilter) => {
                        setFilterCriteria(newFilter);
                        closeModal();
                      }}
                      onCancel={() => {
                        setFilterCriteria(defaultFilterCriteria);
                        closeModal();
                      }}
                      tout={totalAttendees}
                      checkedIn={totalCheckedIn}
                      notChechkedIn={totalNotCheckedIn}
                    />
                  </Animated.View>
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>

              {/* 🖨️ Print modal */}
            {printStatus && (
              <CheckinPrintModal
                visible={true}
                status={printStatus}
                onClose={clearStatus}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainee: {
    height: 40,
    marginBottom: 10,
    marginLeft: 'auto',
    width: 40,
    zIndex: 20, // ✅ Pushes the image to the right
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    position : 'relative'
  },
  modalOverlay: {
    backgroundColor: colors.blackTransparent,
    flex: 1,
    justifyContent: 'flex-start',
  },
  modalView: {
    backgroundColor: colors.white,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 300,
  },
  reloadImage: {
    height: 30,
    tintColor: colors.green,
    width: 30,
  },
});

export default AttendeeListScreen;


