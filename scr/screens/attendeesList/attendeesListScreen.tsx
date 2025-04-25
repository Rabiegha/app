import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import List, { ListHandle } from '../../components/screens/attendees/List';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import ProgressText from '../../components/elements/progress/ProgressionText';
import globalStyle from '../../assets/styles/globalStyle';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import HeaderParticipants from '../../components/elements/header/HeaderParticipant';
import SuccessComponent from '../../components/elements/notifications/SuccessComponent';
import { useEvent } from '../../context/EventContext';
import Search from '../../components/elements/Search';
import FiltreComponent from '../../components/filtre/FiltreComponent';
import { useDispatch, useSelector } from 'react-redux';
import { selectPrintStatus } from '../../redux/selectors/print/printerSelectors';
import { setPrintStatus } from '../../redux/slices/printerSlice';
import PrintModal from '../../components/elements/modals/PrintModal';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import refreshIcon from '../../assets/images/icons/refresh.png';
import colors from '../../assets/colors/colors';

const defaultFilterCriteria = {
  status: 'all',
  company: null,
};

const AttendeeListScreen = () => {
  const listRef = useRef<ListHandle>(null);

  const triggerChildRefresh = () => {
    listRef.current?.handleRefresh(); // 🟢 Appel direct de la méthode enfant
  };

  const { eventName } = useEvent();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(-300));
  const [success, setSuccess] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState(defaultFilterCriteria);

  const { totalAttendees, totalCheckedIn, totalNotCheckedIn, ratio, summary } = useRegistrationData({ refreshTrigger1: refreshTrigger });
  const printStatus = useSelector(selectPrintStatus);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLeftPress = () => {
    if (filterCriteria.status === 'all' && !filterCriteria.company) {
      clearSearch();
    } else {
      setFilterCriteria(defaultFilterCriteria);
    }
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
        <Search style={styles.search} onChange={setSearchQuery} value={searchQuery} />
        <ProgressText totalCheckedAttendees={totalCheckedIn} totalAttendees={totalAttendees} />
        <ProgressBar progress={ratio} />

        {/* 🔁 Bouton de reload */}
        <TouchableOpacity style={styles.imageContainee} onPress={triggerChildRefresh}>
          <Image style={styles.reloadImage} source={refreshIcon} />
        </TouchableOpacity>

        {/* 🖨️ Print modal */}
        <View style={styles.printModal}>
          <PrintModal
            onClose={() => dispatch(setPrintStatus(null))}
            visible={!!printStatus}
            status={printStatus}
          />
        </View>

        {/* 📋 Liste des participants */}
        <List
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: 65,
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
  search: {
    top: 20,
  },
  reloadImage: {
    height: 30,
    width: 30,
    tintColor: colors.green,
  },
  imageContainee: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 25,
    top: 55,

  },
});

export default AttendeeListScreen;
