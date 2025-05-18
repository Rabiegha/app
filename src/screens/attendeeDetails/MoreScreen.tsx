// MoreScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import MoreComponent from '../../components/screens/MoreComponent';
import MainHeader from '../../components/elements/header/MainHeader';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';

import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';

import usePrintDocument from '../../printing/hooks/usePrintDocument';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import CheckinPrintModal from '../../components/elements/modals/CheckinPrintModal';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { useAttendee } from '../../hooks/attendee/useAttendee';

const MoreScreen = ({ route, navigation }) => {
  /* ---------------------------------------------------------------- */
  /* Context & Redux                                                   */
  /* ---------------------------------------------------------------- */
  const userId = useSelector(selectCurrentUserId);
  const { eventId } = useActiveEvent();
  const { 
    attendeeDetails, 
    isLoadingDetails, 
    isUpdating, 
    error,
    fetchAttendeeDetails, 
    updateAttendeeStatus 
  } = useAttendee();

  /* ---------------------------------------------------------------- */
  /* Navigation params                                                */
  /* ---------------------------------------------------------------- */
  const {
    attendeeId,
    type,
  } = route.params;

  /* ---------------------------------------------------------------- */
  /* Local state                                                      */
  /* ---------------------------------------------------------------- */
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /* ---------------------------------------------------------------- */
  /* Data fetching                                                    */
  /* ---------------------------------------------------------------- */
  const fetchData = useCallback(() => {
    if (userId && eventId && attendeeId) {
      fetchAttendeeDetails({
        userId,
        eventId,
        attendeeId
      });
    }
  }, [userId, eventId, attendeeId, fetchAttendeeDetails]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh when coming back to this screen
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  // Refresh when refresh trigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger, fetchData]);

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
    navigation.navigate('Badge', { 
      attendeeId, 
      eventId, 
      badgePdfUrl: attendeeDetails?.urlBadgePdf 
    });

  const { printDocument } = usePrintDocument();
  const handlePrintDocument = () => {
    if (attendeeDetails?.urlBadgePdf) {
      printDocument(attendeeDetails.urlBadgePdf, undefined, true);
    }
  };

  const handleCheckinButton = async (status: 0 | 1) => {
    if (userId && eventId && attendeeId) {
      await updateAttendeeStatus({
        userId,
        eventId,
        attendeeId,
        status
      });
    }
  };

  /* ---------------------------------------------------------------- */
  /* Render helpers                                                   */
  /* ---------------------------------------------------------------- */
  const renderContent = () => {
    if (isLoadingDetails && !attendeeDetails) {
      return (
        <View style={styles.filler}>
          <LoadingView />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={styles.filler}>
          <ErrorView handleRetry={fetchData} />
        </View>
      );
    }

    if (!attendeeDetails) {
      return (
        <View style={styles.filler}>
          <ErrorView message="No attendee details found" handleRetry={fetchData} />
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
        attendeeStatus={attendeeDetails.attendeeStatus}
        organization={attendeeDetails.organization}
        commentaire={attendeeDetails.commentaire}
        attendeeId={attendeeId}
        attendeeStatusChangeDatetime={attendeeDetails.attendeeStatusChangeDatetime}
        handleCheckinButton={handleCheckinButton}
        Print={handlePrintDocument}
        loading={isUpdating}
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
