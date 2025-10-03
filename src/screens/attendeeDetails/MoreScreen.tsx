// MoreScreen.tsx
import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { AttendeeData } from '../../types/badge/badge.types';
import { useAppDispatch } from '../../redux/store';
import { updateAttendeeLocally } from '../../features/attendee';
import MoreComponent from '../../components/screens/MoreComponent';
import MainHeader from '../../components/elements/header/MainHeader';
import ErrorView from '../../components/elements/view/ErrorView';
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import usePrintDocument from '../../printing/hooks/usePrintDocument';
import { selectCurrentUserId, selectUserType } from '../../redux/selectors/auth/authSelectors';
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
  BadgePreviewScreen: { attendeesData: AttendeeData[] };
  Edit: { attendeeId: string; eventId: string };
};

// Define the props type for the component
type MoreScreenProps = {
  route: RouteProp<RootStackParamList, 'More'>;
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const MoreScreen = ({ route, navigation }: MoreScreenProps) => {
  /* Context & Redux  */
  const userId = useSelector(selectCurrentUserId);
  const userType = useSelector(selectUserType);
  const { eventId } = useActiveEvent();
  const dispatch = useAppDispatch();
  const { 
    attendeeDetails, 
    isLoadingDetails, 
    loadingAttendeeId,
    isUpdating, 
    error,
    fetchAttendeeDetails, 
    updateAttendeeStatus,
    // Partner attendees
    partnerAttendeeDetails,
    isLoadingPartnerDetails,
    partnerError,
    fetchPartnerAttendeeDetails
  } = useAttendee();

  // Determine if user is a partner
  const isPartner = userType?.toLowerCase() === 'partner';

  /* Navigation params */

  const {
    attendeeId,
    comment,
  } = route.params;


  // Check if we have the correct details for this attendee (partner or regular)
  const hasDetailsForThis = isPartner 
    ? partnerAttendeeDetails?.attendeeId === attendeeId
    : attendeeDetails?.theAttendeeId === attendeeId;


  /* Local state */

  const [refreshTrigger, setRefreshTrigger] = useState(0);




  /* Data fetching */

  const fetchData = useCallback(() => {
    if (userId && eventId && attendeeId) {
      if (isPartner) {
        // Use partner attendee service for partners
        fetchPartnerAttendeeDetails({
          userId,
          eventId,
          attendeeId
        });
      } else {
        // Use regular attendee service for non-partners
        fetchAttendeeDetails({
          userId,
          eventId,
          attendeeId
        });
      }
    }
  }, [userId, eventId, attendeeId, isPartner, fetchAttendeeDetails, fetchPartnerAttendeeDetails]);


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

  /* Handlers */

  const handleBackPress = () => navigation.goBack();

  const handleBadgePress = () => {
    if (attendeeDetails) {
      // Transform AttendeeDetails to AttendeeData format
      const attendeeData: AttendeeData = {
        id: attendeeDetails.theAttendeeId,
        first_name: attendeeDetails.firstName,
        last_name: attendeeDetails.lastName,
        email: attendeeDetails.email,
        phone: attendeeDetails.phone,
        organization: attendeeDetails.organization,
        job_title: attendeeDetails.jobTitle,
        badge_pdf_url: attendeeDetails.urlBadgePdf,
        badge_image_url: attendeeDetails.urlBadgeImage,
      };
      
      navigation.navigate('BadgePreviewScreen', { attendeesData: [attendeeData] });
    }
  };

  const { printDocument } = usePrintDocument();
  const handlePrintAndCheckIn = () => {
    if (attendeeDetails?.urlBadgePdf) {
      printDocument(attendeeDetails.urlBadgePdf, undefined, true);
    }
  };

  const handleCheckinButton = async (status: 0 | 1) => {
    if (userId && eventId && attendeeId && attendeeDetails) {
      // Store the original status to revert if needed
      const originalStatus = attendeeDetails.attendeeStatus;
      console.log('originalStatus', originalStatus)
      
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
        })
        .catch((error: Error) => {
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

  //should load skeleton
  // Show skeleton when:
  // 1. We don't have the correct data for this attendee AND we're currently loading this specific attendee
  // 2. OR we have no attendee data at all and we're loading
  const shouldShowSkeleton = isPartner
    ? (!hasDetailsForThis && isLoadingPartnerDetails) || (!partnerAttendeeDetails && isLoadingPartnerDetails)
    : (!hasDetailsForThis && loadingAttendeeId === attendeeId) || (!attendeeDetails && isLoadingDetails);




  /* Render helpers */

  const renderContent = () => {
    // Show skeleton if we should show it OR if we have wrong attendee data
    if (shouldShowSkeleton || (isPartner ? (partnerAttendeeDetails && !hasDetailsForThis) : (attendeeDetails && !hasDetailsForThis))) {
      return (
        <MoreComponent
          See={() => {}}
          firstName=""
          lastName=""
          email=""
          phone=""
          JobTitle=""
          attendeeStatus={0}
          organization=""
          commentaire=""
          attendeeId={attendeeId}
          attendeeStatusChangeDatetime=""
          handleCheckinButton={async () => {}}
          PrintAndCheckIn={() => {}}
          loading={false}
          modify={() => {}}
          type=""
          onFieldUpdateSuccess={() => {}} 
          isLoading={true}
        />
      );
    }

    // Handle errors for both partner and regular users
    const currentError = isPartner ? partnerError : error;
    const currentDetails = isPartner ? partnerAttendeeDetails : attendeeDetails;
    
    // Only show error if we're not loading and have a real error
    // This prevents the error view from flashing during initial load
    if (currentError && !shouldShowSkeleton && currentDetails === null) {
      // Check if this is a partner-specific error message
      const isPartnerPermissionsError = typeof currentError === 'string' && 
        currentError.includes('partner users') && 
        currentError.includes('permissions');
      
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

    // Get the appropriate details based on user type
    const details = isPartner ? partnerAttendeeDetails : attendeeDetails;

    // Use the comment from route params if it exists, otherwise use from attendee details
    // Handle different comment field names for partner vs regular attendees
    let commentText = comment || '';
    if (!commentText && details) {
      if (isPartner && 'comment' in details) {
        commentText = details.comment || '';
      } else if (!isPartner && 'commentaire' in details) {
        commentText = details.commentaire || '';
      }
    }

    // Map data to component props based on user type
    const componentProps = isPartner && details && 'attendeeTypeName' in details ? {
      // Partner attendee props
      firstName: details.firstName || '',
      lastName: details.lastName || '',
      email: details.email || '',
      phone: details.phone || '',
      JobTitle: details.jobTitle || '',
      attendeeStatus: 0, // Partners don't have check-in status
      organization: details.organization || '',
      commentaire: commentText,
      attendeeStatusChangeDatetime: details.createdOn || '', // Use creation date for partners
      type: details.attendeeTypeName || '',
    } : details && 'attendeeStatus' in details ? {
      // Regular attendee props
      firstName: details.firstName || '',
      lastName: details.lastName || '',
      email: details.email || '',
      phone: details.phone || '',
      JobTitle: details.jobTitle || '',
      attendeeStatus: details.attendeeStatus ?? 0,
      organization: details.organization || '',
      commentaire: commentText,
      attendeeStatusChangeDatetime: details.attendeeStatusChangeDatetime || '',
      type: details.type || '',
    } : {
      // Fallback empty props
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      JobTitle: '',
      attendeeStatus: 0,
      organization: '',
      commentaire: commentText,
      attendeeStatusChangeDatetime: '',
      type: '',
    };

    return (
      <MoreComponent
        See={handleBadgePress}
        {...componentProps}
        attendeeId={attendeeId}
        handleCheckinButton={handleCheckinButton}
        PrintAndCheckIn={handlePrintAndCheckIn}
        loading={isUpdating}
        modify={() => navigation.navigate('Edit', { attendeeId, eventId })}
        onFieldUpdateSuccess={triggerRefresh} 
        isLoading={shouldShowSkeleton}
        />
    );
  };


  /* JSX */
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
