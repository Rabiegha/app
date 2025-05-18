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
      try {
        // First update the status
        await updateAttendeeStatus({
          userId,
          eventId,
          attendeeId,
          status
        });
        
        // Then fetch the updated attendee details to get the new timestamp
        await fetchAttendeeDetails({
          userId,
          eventId,
          attendeeId
        });
      } catch (error) {
        console.error('Error during check-in process:', error);
      }
    }
  };

  /* ---------------------------------------------------------------- */
  /* Render helpers                                                   */
  /* ---------------------------------------------------------------- */
  const renderContent = () => {
    // Always show loading first when we're fetching data
    if (isLoadingDetails) {
      return (
        <View style={styles.filler}>
          <LoadingView />
        </View>
      );
    }
    
    // Only show error if we're not loading and have a real error
    // This prevents the error view from flashing during initial load
    if (error && !isLoadingDetails) {
      return (
        <View style={styles.filler}>
          <ErrorView handleRetry={fetchData} />
        </View>
      );
    }

    // Only show this if we're not loading and have no data
    if (!attendeeDetails && !isLoadingDetails) {
      return (
        <View style={styles.filler}>
          <ErrorView message="No attendee details found" handleRetry={fetchData} />
        </View>
      );
    }

    // We've already checked for !attendeeDetails above, so we know it exists here
    // But TypeScript still needs the null check, so we'll use a default empty object if needed
    const details = attendeeDetails || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      jobTitle: '',
      attendeeStatus: 0,
      organization: '',
      commentaire: '',
      attendeeStatusChangeDatetime: '',
      type: '',
      urlBadgePdf: ''
    };
    
    return (
      <MoreComponent
        See={handleBadgePress}
        firstName={details.firstName}
        lastName={details.lastName}
        email={details.email}
        phone={details.phone}
        JobTitle={details.jobTitle}
        attendeeStatus={details.attendeeStatus}
        organization={details.organization}
        commentaire={details.commentaire}
        attendeeId={attendeeId}
        attendeeStatusChangeDatetime={details.attendeeStatusChangeDatetime}
        handleCheckinButton={handleCheckinButton}
        Print={handlePrintDocument}
        loading={isUpdating}
        modify={() => navigation.navigate('Edit', { attendeeId, eventId })}
        type={details.type}
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
    flex: 1,
    minHeight: 500,
  },
  filler: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    height: '100%',
  },
});

export default MoreScreen;
