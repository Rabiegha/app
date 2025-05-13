// MoreScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';
import Share from 'react-native-share';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import MoreComponent from '../../components/screens/MoreComponent';
import MainHeader from '../../components/elements/header/MainHeader';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';

import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import { BASE_URL } from '../../config/config';

import usePrintDocument from '../../hooks/print/usePrintDocument';
import useFetchAttendeeDetails from '../../hooks/attendee/useAttendeeDetails';
import { useEvent } from '../../context/EventContext';
import { setPrintStatus } from '../../redux/slices/printerSlice';
import { selectPrintStatus } from '../../redux/selectors/print/printerSelectors';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import CheckinPrintModal from '../../components/elements/modals/CheckinPrintModal';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';

const MoreScreen = ({ route, navigation }) => {
  /* ---------------------------------------------------------------- */
  /* Context & Redux                                                 */
  /* ---------------------------------------------------------------- */
  const { updateAttendee } = useEvent();
  const { eventId } = useEvent();
  /* ---------------------------------------------------------------- */
  /* Navigation params                                                */
  /* ---------------------------------------------------------------- */
  const {
    attendeeId,
    attendeeStatus: initialStatus,
    badgePdfUrl,
    badgeImageUrl,
    type,
  } = route.params;

  /* ---------------------------------------------------------------- */
  /* Local state                                                      */
  /* ---------------------------------------------------------------- */
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadingButton , setLoadingButton ] = useState(false);
  const [localAttendeeStatus, setLocalAttendeeStatus] = useState(initialStatus);

  /* ---------------------------------------------------------------- */
  /* Data fetching                                                    */
  /* ---------------------------------------------------------------- */
  const { attendeeDetails, loading, error } =
    useFetchAttendeeDetails(refreshTrigger, attendeeId);


  /* refresh helper */
  const triggerRefresh = useCallback(
    () => setRefreshTrigger(prev => prev + 1),
    []
  );


  const { status: printStatus, clearStatus } = usePrintStatus();

  /* ---------------------------------------------------------------- */
  /* Handlers                                                         */
  /* ---------------------------------------------------------------- */
  const handleBackPress = () => navigation.goBack();

  const handleBadgePress = () =>
    navigation.navigate('Badge', { attendeeId, eventId, badgePdfUrl, badgeImageUrl });

  const { printDocument } = usePrintDocument();
  const handlePrintDocument = () => printDocument(badgePdfUrl);

  const sendPdf = async () => {
    try {
      await Share.open({ url: badgePdfUrl, type: 'application/pdf' });
    } catch (err) { console.error(err); }
  };

  const handleButton = async (status: 0 | 1) => {
    setLoadingButton(true);

    try {
      const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${eventId}&attendee_id=${attendeeId}&attendee_status=${status}`;
      const res = await axios.post(url);

      if (res.data.status) {
        setLocalAttendeeStatus(status);
        triggerRefresh();
      }
    } catch (err) {
      console.error('Error updating attendee status:', err);
    } finally {
      setLoadingButton(false);
    }
  };

  /* update parent lists when status changes */
  useEffect(() => {
    updateAttendee(eventId, localAttendeeStatus);
  }, [localAttendeeStatus]);

  /* ---------------------------------------------------------------- */
  /* Render helpers                                                   */
  /* ---------------------------------------------------------------- */
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.filler}>
          <LoadingView />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.filler}>
          <ErrorView handleRetry={triggerRefresh} />
        </View>
      );
    }

    return (
      <MoreComponent
        See={handleBadgePress}
        firstName={attendeeDetails.firstName}
        lastName={attendeeDetails.lastName}
        email={attendeeDetails.email}
        phone={attendeeDetails.phone}
        JobTitle={attendeeDetails.jobTitle}
        attendeeStatus={localAttendeeStatus}
        organization={attendeeDetails.organization}
        commentaire={attendeeDetails.commentaire}
        attendeeId = {attendeeId}
        attendeeStatusChangeDatetime={attendeeDetails.attendeeStatusChangeDatetime}
        handleButton={handleButton}
        share={sendPdf}
        Print={handlePrintDocument}
        loading={loadingButton}
        modify={() => navigation.navigate('Edit', { attendeeId, eventId })}
        type={type}
        onFieldUpdateSuccess={triggerRefresh}
      />
    );
  };

  /* ---------------------------------------------------------------- */
  /* JSX                                                              */
  /* ---------------------------------------------------------------- */
  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        title="Profil"
        color={colors.darkGrey}
        onLeftPress={handleBackPress}
      />

      <View style={[globalStyle.container, styles.profil]}>
        {/* Print status modal stays available at all times */}
        {/* 🖨️ Print modal */}
        {printStatus && (
        <CheckinPrintModal
          visible={true}
          status={printStatus}
          onClose={clearStatus}
        />
      )}

        {/* The area below is where we swap in loading / error / data */}
        {renderContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profil: {
    height: 1700,
  },
  filler: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default MoreScreen;
