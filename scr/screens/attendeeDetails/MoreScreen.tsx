import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import Share from 'react-native-share';
import MoreComponent from '../../components/screens/MoreComponent';
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import { BASE_URL } from '../../config/config';
import { useEvent } from '../../context/EventContext';
import usePrintDocument from '../../hooks/print/usePrintDocument';
import { setPrintStatus } from '../../redux/slices/printerSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectPrintStatus } from '../../redux/selectors/print/printerSelectors';
import PrintModal from '../../components/elements/modals/PrintModal';
import useFetchAttendeeDetails from '../../hooks/attendee/useAttendeeDetails';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';
import { useFocusEffect } from '@react-navigation/native';
import MainHeader from '../../components/elements/header/MainHeader';

const MoreScreen = ({ route, navigation }) => {
  const { triggerListRefresh, updateAttendee } = useEvent();
  const userId = useSelector(selectCurrentUserId);
  const dispatch = useDispatch();
  const printStatus = useSelector(selectPrintStatus);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const {
    eventId,
    attendeeId,
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    attendeeStatus,
    organization,
    type,
    typeId,
    badgePdfUrl,
    badgeImageUrl,
    attendeeStatusChangeDatetime,
  } = route.params;

  const [localAttendeeStatus, setLocalAttendeeStatus] = useState(attendeeStatus);

  const { attendeeDetails, loading, error } = useFetchAttendeeDetails(refreshTrigger, attendeeId);

  useEffect(() => {
    const updatedAttendee = {
      id: attendeeId,
      attendee_status: localAttendeeStatus,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      jobTitle: jobTitle,
      type: type,
      typeId: typeId,
      event_id: eventId,
      badge_pdf_url: badgePdfUrl,
      badge_image_url: badgeImageUrl,
      attendeeStatusChangeDatetime: attendeeStatusChangeDatetime,
    };
    updateAttendee(eventId, updatedAttendee);
    triggerListRefresh();
  }, [localAttendeeStatus]);

  useFocusEffect(
    useCallback(() => {
      triggerRefresh();
    }, [triggerRefresh])
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBadgePress = () => {
    navigation.navigate('Badge', {
      attendeeId,
      eventId,
      badgePdfUrl,
      badgeImageUrl,
    });
  };

  const handleButton = async status => {
    console.log('handleButton called');
    setLoadingButton(true);

    const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${eventId}&attendee_id=${attendeeId}&attendee_status=${status}`;

    try {
      const response = await axios.post(url);

      if (response.data.status) {
        console.log('Status updated locally');
        setLocalAttendeeStatus(status);
        triggerRefresh();
      } else {
        console.error('Failed to update attendee status');
      }
    } catch (error) {
      console.error('Error updating attendee status:', error);
    } finally {
      setLoadingButton(false);
    }
  };

  const { printDocument } = usePrintDocument();

  const handlePrintDocument = () => {
    printDocument(badgePdfUrl);
  };

  const sendPdf = async () => {
    try {
      await Share.open({
        url: badgePdfUrl,
        type: 'application/pdf',
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView handleRetry={triggerRefresh} />;
  }

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        color={colors.darkGrey}
        onLeftPress={handleBackPress}
        title="Profil"
      />
      <View style={[globalStyle.container, styles.profil]}>
        <PrintModal
          onClose={() => dispatch(setPrintStatus(null))}
          visible={!!printStatus}
          status={printStatus}
        />
        <MoreComponent
          See={handleBadgePress}
          firstName={attendeeDetails.Prenom}
          lastName={lastName}
          email={email}
          phone={phone}
          JobTitle={jobTitle}
          attendeeStatus={localAttendeeStatus}
          organization={organization}
          attendeeStatusChangeDatetime={attendeeDetails.attendeeStatusChangeDatetime}
          handleButton={handleButton}
          share={sendPdf}
          Print={handlePrintDocument}
          loading={loadingButton}
          modify={() => navigation.navigate('Edit', { attendeeId, eventId })}
          type={type}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profil: {
    height: 1700,
  },
});

export default MoreScreen;
