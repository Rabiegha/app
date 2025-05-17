import React, { useRef, useState, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectPrintStatus } from '../../redux/selectors/print/printerSelectors';
import { setPrintStatus } from '../../redux/slices/printerSlice';
import CheckinPrintModal from '../../components/elements/modals/CheckinPrintModal';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import Icons from '../../assets/images/icons';
import colors from '../../assets/colors/colors';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const defaultFilterCriteria = {
  status: 'all',
  company: null,
};

const AttendeeListScreen = () => {
  const listRef = useRef<ListHandle>(null);

  const triggerChildRefresh = () => {
    listRef.current?.handleRefresh(); // 🟢 Appel direct de la méthode enfant
  };

    useFocusEffect(
    useCallback(() => {
      // 1) on déclenche la remise à jour des stats (useRegistrationData)
      setRefreshTrigger(p => p + 1);

    }, []),
  );

  const { eventName } = useEvent();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState<Animated.Value>(new Animated.Value(-300));
  const [success, setSuccess] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState(defaultFilterCriteria);

  const { totalAttendees, totalCheckedIn, totalNotCheckedIn, ratio, summary } = useRegistrationData({ refreshTrigger1: refreshTrigger });
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Use the properly typed PrintStatus context
const { status: printStatus, clearStatus } = usePrintStatus();

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
                onShowNotification={() => setSuccess(true)}
                filterCriteria={filterCriteria}
                onTriggerRefresh={handleTriggerRefresh}
                summary={summary}
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
