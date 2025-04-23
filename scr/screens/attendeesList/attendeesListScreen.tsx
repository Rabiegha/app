import React, {useEffect, useState} from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import List from '../../components/screens/attendees/List';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import ProgressText from '../../components/elements/progress/ProgressionText';
import globalStyle from '../../assets/styles/globalStyle';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HeaderParticipants from '../../components/elements/header/HeaderParticipant';
import SuccessComponent from '../../components/elements/notifications/SuccessComponent';
import {useEvent} from '../../context/EventContext';
import Search from '../../components/elements/Search';
import FiltreComponent from '../../components/filtre/FiltreComponent';
import {useDispatch, useSelector} from 'react-redux';
import {selectPrintStatus} from '../../redux/selectors/print/printerSelectors';
import {setPrintStatus} from '../../redux/slices/printerSlice';
import PrintModal from '../../components/elements/modals/PrintModal';
import useRegistrationData from '../../hooks/registration/useRegistrationData';


// Define a default set of filters
const defaultFilterCriteria = {
  status: 'all',      // 'all', 'checked-in', 'not-checked-in'
  company: null,      // or an empty string [] if you allow multiple
};

const AttendeeListScreen = () => {

  useFocusEffect(
    React.useCallback(() => {
      setRefreshTrigger(prev => prev + 1);
      StatusBar.setBarStyle('dark-content'); // Set status bar style to light-content
      return () => {
        // This is useful if this screen has a unique StatusBar style                                                                                                                                                          '); // Reset status bar style when screen loses focus
      };
    }, []),
  );
  // event name
  const {eventName} = useEvent();

  // set refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  //search query
  const [searchQuery, setSearchQuery] = useState('');
  //modal handling
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(-300));

  const [success, setSuccess] = useState(false);

  //Filter Critererias
  const [filterCriteria, setFilterCriteria] = useState(defaultFilterCriteria);

  // Registration data :
  const {totalAttendees, totalCheckedIn, totalNotCheckedIn, ratio, summary} = useRegistrationData(refreshTrigger);

  const printStatus = useSelector(selectPrintStatus);

  const dispatch = useDispatch();

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const showNotification = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  };

  const closeModal = () => {
    // Animate the modal to slide out to the left
    Animated.timing(modalAnimation, {
      toValue: -300, // Move back to the initial off-screen position
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false)); // Hide the modal after the animation
  };

  const navigation = useNavigation();


  const clearSearch = () => {
    if (searchQuery !== '') {
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };


  const handleTriggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1); // 🔄 This will trigger `useEffect` in useRegistrationSummary
  };

    /**
   * Decide how the left button acts:
   * If filters are currently default, do your normal "clearSearch" or go back logic.
   * Otherwise, reset the filters to default.
   */
    const handleLeftPress = () => {
      if (isDefaultFilter(filterCriteria)) {
        // If we have the default filters, do your old logic:
        // either "go back" or "clearSearch"
        clearSearch();
      } else {
        // Reset filters to default
        setFilterCriteria(defaultFilterCriteria);
      }
    };

    // Utility to check if filters are currently at default
    const isDefaultFilter = (fc) => {
      return fc.status === 'all' && !fc.company;
    };

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderParticipants
        onLeftPress={handleLeftPress}
        onRightPress={openModal}
        Title={eventName}
      />
      {success && (
        <View style={styles.notification}>
          <SuccessComponent
            onClose={() => setSuccess(null)}
            text={'Votre participation à l’évènement\nà bien été enregistrée'}
          />
        </View>
      )}
      <View style={[globalStyle.container, styles.container]}>
        <Search
          style={styles.search}
          onChange={text => setSearchQuery(text)}
          value={searchQuery}
        />

        <ProgressText
          totalCheckedAttendees={totalCheckedIn}
          totalAttendees={totalAttendees}
        />
        <ProgressBar progress={ratio} />
        <View style={styles.printModal}>
          <PrintModal
            onClose={() => dispatch(setPrintStatus(null))}
            visible={!!printStatus}
            status={printStatus}
          />
        </View>
        <List
          searchQuery={searchQuery}
          onShowNotification={showNotification}
          filterCriteria={filterCriteria}
          onTriggerRefresh={handleTriggerRefresh}
          summary={summary}
        />

        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={closeModal}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalView,
                  {transform: [{translateX: modalAnimation}]}, // Use the animated value for the translation
                ]}>
                {
              <FiltreComponent
                    // We pass in the *current* filters to show in the modal
                    initialFilter={filterCriteria}
                    defaultFilter={defaultFilterCriteria}
                    onApply={(newFilter) => {
                      // (1) Apply the new filter
                      setFilterCriteria(newFilter);
                      // (2) Close modal
                      closeModal();
                    } }
                    onCancel={() => {
                      // (1) Reset to default
                      setFilterCriteria(defaultFilterCriteria);
                      // (2) Close modal
                      closeModal();
                    } } tout={totalAttendees} checkedIn={totalCheckedIn} notChechkedIn={totalNotCheckedIn}                />
                }
              </Animated.View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  printModal: {
    flex: 1,
    position: 'absolute',
  },
  eventName: {
    top: 40,
  },
  modalView: {
    width: 300, // Width of the modal
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  notification: {
    zIndex: 50,
  },
  search: {
    top: 20,
  },
});

export default AttendeeListScreen;
