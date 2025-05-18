import React, { useRef, useState, useCallback, useEffect, useContext } from 'react';
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
import MainAttendeeListItem, { ListHandle } from '../../components/screens/attendees/mainAttendeeList/MainAttendeeList';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import ProgressText from '../../components/elements/progress/ProgressionText';
import MainHeader from '../../components/elements/header/MainHeader';
import { useEvent } from '../../context/EventContext';
import Search from '../../components/elements/Search';
import FiltreComponent from '../../components/filtre/FiltreComponent';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../redux/store';
import { fetchAttendeesList, updateAttendeeLocally } from '../../redux/slices/attendee/attendeeSlice';
import { updateAttendee } from '../../redux/thunks/attendee/updateAttendeeThunk';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import CheckinPrintModal from '../../components/elements/modals/CheckinPrintModal';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import Icons from '../../assets/images/icons';
import colors from '../../assets/colors/colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import usePrintDocument from '../../printing/hooks/usePrintDocument';
import { AuthContext } from '../../context/AuthContext';
import { Attendee } from '../../types/attendee.types';

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
  
  // Attendee data from Redux
  const { list: allAttendees, isLoadingList, error } = useSelector((state: any) => state.attendee);
  
  // Registration data for stats
  const { totalAttendees, totalCheckedIn, totalNotCheckedIn, ratio, summary } = useRegistrationData({ refreshTrigger1: refreshTrigger });
  
  // Fetch attendees when screen is focused
  // useFocusEffect(
  //   useCallback(() => {
  //     fetchAttendeesData();
  //     setRefreshTrigger(p => p + 1);
  //   }, []),
  // );
  
  // Fetch attendees data from API
  // const fetchAttendeesData = async () => {
  //   if (userId && eventId) {
  //     await dispatch(fetchAttendeesList({ userId, eventId: eventId as string }));
  //   }
  // };
  
  // Direct refresh trigger for the child component
  const triggerChildRefresh = () => {
    listRef.current?.handleRefresh();
  };

  const insets = useSafeAreaInsets();

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

  // Handle attendee updates
  const handleUpdateAttendee = async (updatedAttendee: Attendee) => {
    try {
      // Update locally first for immediate UI feedback
      dispatch(updateAttendeeLocally(updatedAttendee));
      
      // Then update on the server
      await dispatch(updateAttendee(updatedAttendee) as any);
      
      // Refresh data after update
      setRefreshTrigger(p => p + 1);
      
      return true; // Indicate success
    } catch (error) {
      console.error('Error updating attendee:', error);
      return false; // Indicate failure
    }
  };
  
  // Handle print and check-in action
  const handlePrintAndCheckIn = async (attendee: Attendee) => {
    try {
      // Update attendee status to checked-in
      const updatedAttendee = {
        ...attendee,
        attendee_status: 1 as const,
      };
      
      // First update Redux store locally for immediate UI feedback
      dispatch(updateAttendeeLocally(updatedAttendee));
      
      // Show success notification immediately
      setStatus('checkin_success');
      
      // Print badge if available
      if (attendee.badge_pdf_url && 
          typeof attendee.badge_pdf_url === 'string' && 
          attendee.badge_pdf_url.trim() !== '') {
        try {
          // Print the badge right away
          await printDocument(attendee.badge_pdf_url, undefined, true);
        } catch (printError) {
          console.error('Error printing badge:', printError);
          setStatus('unknown_error');
        }
      } else {
        console.error('Badge PDF URL is empty or invalid:', attendee.badge_pdf_url);
        setStatus('file_not_found');
      }
      
      // Then update on the server (don't wait for this to complete before printing)
      try {
        await dispatch(updateAttendee(updatedAttendee) as any);
        // Refresh data after update
        setRefreshTrigger(p => p + 1);
      } catch (apiError) {
        console.error('Error updating attendee on server:', apiError);
        // Don't change the status if printing was successful
      }
    } catch (error) {
      console.error('Error while printing and checking in:', error);
      setStatus('unknown_error');
    }
  };
  
  // Handle toggle check-in status
  const handleToggleCheckIn = async (attendee: Attendee) => {
    // Toggle attendee status
    const updatedAttendee = {
      ...attendee,
      attendee_status: attendee.attendee_status === 0 ? (1 as const) : (0 as const),
    };
    
    // Update in Redux and API
    await handleUpdateAttendee(updatedAttendee);
    setStatus('checkin_success');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>

      <View style={{ flex: 1 }}>
          <MainHeader
            onLeftPress={handleLeftPress}
            onRightPress={openModal}
            RightIcon={Icons.Filtre}
            title={eventName}
          />
        <View style={[styles.mainContent,     {
          paddingTop: 35 ,
        },]}>
            <Search style={styles.search} onChange={setSearchQuery} value={searchQuery} />
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
                onShowNotification={() => setStatus('checkin_success')}
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  printModal: {
    flex: 1,
    position: 'absolute',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  notification: {
    zIndex: 50,
  },
  reloadImage: {
    height: 30,
    width: 30,
    tintColor: colors.green,
  },
  imageContainee: {
    height: 40,
    width: 40,
    zIndex: 20,
    marginBottom: 10,
    marginLeft: 'auto', // ✅ Pushes the image to the right
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    position : 'relative'
  },
});

export default AttendeeListScreen;
