// MoreScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../redux/store';
import { updateAttendeeLocally, clearSelectedAttendee } from '../../redux/slices/attendee/attendeeSlice';
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

// Define the route params type
type MoreScreenRouteParams = {
  attendeeId: string;
  comment?: string;
  eventId?: string;
};

// Define the navigation stack param list type
type RootStackParamList = {
  More: MoreScreenRouteParams;
  Badge: { attendeeId: string; eventId: string; badgePdfUrl: string; badgeImageUrl: string };
  Edit: { attendeeId: string; eventId: string };
};

// Define the props type for the component
type MoreScreenProps = {
  route: RouteProp<RootStackParamList, 'More'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const MoreScreen = ({ route, navigation }: MoreScreenProps) => {
  /* ---------------------------------------------------------------- */
  /* Context & Redux                                                   */
  /* ---------------------------------------------------------------- */
  const userId = useSelector(selectCurrentUserId);
  const { eventId } = useActiveEvent();
  const dispatch = useAppDispatch();
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
    comment,
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
      
      // Only clear data when navigating away, don't show error state
      return () => {
        // Clear selected attendee when leaving the screen to ensure
        // we don't see stale data when returning to this screen
        dispatch(clearSelectedAttendee());
      };
    }, [fetchData, dispatch])
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
      badgePdfUrl: attendeeDetails?.urlBadgePdf || '',
      badgeImageUrl: attendeeDetails?.urlBadgeImage || '',
    });

  const { printDocument } = usePrintDocument();
  const handlePrintAndCheckIn = () => {
    if (attendeeDetails?.urlBadgePdf) {
      printDocument(attendeeDetails.urlBadgePdf, undefined, true);
    }
  };

  const handleCheckinButton = async (status: 0 | 1) => {
    if (userId && eventId && attendeeId && attendeeDetails) {
      // Store the original status to revert if needed
      const originalStatus = attendeeDetails.attendeeStatus as 0 | 1;
      
      try {
        // First update locally for immediate UI feedback
        dispatch(updateAttendeeLocally({
          id: parseInt(attendeeId),
          attendee_status: status,
          event_id: eventId
        }));
        
        // Then update on the server
        const success = await updateAttendeeStatus({
          userId,
          eventId,
          attendeeId,
          status
        }).catch((error: Error) => {
          // If API call fails, revert the local change
          console.error('API call failed:', error);
          return false;
        });
        
        // If the server update failed, revert the local change
        if (!success) {
          // Revert to original status
          dispatch(updateAttendeeLocally({
            id: parseInt(attendeeId),
            attendee_status: originalStatus,
            event_id: eventId
          }));
          
          // Show error message to user
          console.error('Failed to update check-in status. Please check your internet connection.');
          // You can replace this with a proper toast or notification component
        }
      } catch (error) {
        console.error('Error during check-in process:', error);
        
        // Revert to original status on any error
        dispatch(updateAttendeeLocally({
          id: parseInt(attendeeId),
          attendee_status: originalStatus,
          event_id: eventId
        }));
        
        // Show error message to user
        console.error('Failed to update check-in status. Please check your internet connection.');
        // You can replace this with a proper toast or notification component
      }
    }
  };

  /* ---------------------------------------------------------------- */
  /* Render helpers                                                   */
  /* ---------------------------------------------------------------- */
  const renderContent = () => {
    // Always show loading first when we're fetching data
    if (isLoadingDetails && !attendeeDetails) {
      return (
        <View style={styles.filler}>
          <LoadingView />
        </View>
      );
    }
    
    // Only show error if we're not loading and have a real error
    // This prevents the error view from flashing during initial load
    if (error && !isLoadingDetails && attendeeDetails === null) {
      // Check if this is a partner-specific error message
      const isPartnerPermissionsError = typeof error === 'string' && 
        error.includes('partner users') && 
        error.includes('permissions');
      
      return (
        <View style={styles.filler}>
          <ErrorView 
            handleRetry={fetchData}
            message={isPartnerPermissionsError ? 
              'Partners do not have access to this attendee data. Please contact an administrator if you need this information.' : 
              'An error occurred'
            }
          />
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
      urlBadgePdf: '',
      urlBadgeImage: ''
    };
    
    // Use the comment from route params if it exists, otherwise use from attendee details
    const commentText = comment || details.commentaire || '';
    
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
        commentaire={commentText}
        attendeeId={attendeeId}
        attendeeStatusChangeDatetime={details.attendeeStatusChangeDatetime}
        handleCheckinButton={handleCheckinButton}
        PrintAndCheckIn={handlePrintAndCheckIn}
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
  filler: { 
    alignItems: 'center', 
    flex: 1,
    height: '100%',
    justifyContent: 'center', 
  },
  profil: {
    flex: 1,
    minHeight: 500,
  },
});

export default MoreScreen;
