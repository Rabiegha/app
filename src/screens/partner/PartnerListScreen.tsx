import React, {useState} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation, useFocusEffect, NavigationProp, ParamListBase} from '@react-navigation/native';
import {useSelector} from 'react-redux';

import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';
import Icons from '../../assets/images/icons';
import MainHeader from '../../components/elements/header/MainHeader';
import CommonAttendeeList from '../../components/elements/commonAttendeeList/CommonAttendeeList';
import { useAttendee } from '../../hooks/attendee/useAttendee';
import { useEvent } from '../../context/EventContext';
import { PartnerAttendee } from '../../features/attendee/attendee.types';
import { Attendee } from '../../types/attendee.types';

interface EventContextType {
  eventId: string;
  eventName: string;
}

// Fonction pour mapper PartnerAttendee vers Attendee
const mapPartnerAttendeeToAttendee = (partnerAttendee: PartnerAttendee): Attendee => {
  return {
    id: parseInt(partnerAttendee.attendee_id),
    first_name: partnerAttendee.first_name,
    last_name: partnerAttendee.last_name,
    email: partnerAttendee.email,
    phone: partnerAttendee.phone,
    organization: partnerAttendee.organization,
    designation: partnerAttendee.designation,
    attendee_status: 1, // Par défaut, les attendees partenaires sont considérés comme présents
    attendee_type_name: partnerAttendee.attendee_type_name,
    attendee_type_id: parseInt(partnerAttendee.attendee_type_id),
    event_id: parseInt(partnerAttendee.event_id),
    comment: partnerAttendee.comment,
  };
};

const PartnerAttendeesListScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [refreshing, setRefreshing] = useState(false);

  const userId = useSelector(selectCurrentUserId);
  const {eventId, eventName} = useEvent() as EventContextType;
  const {
    partnerAttendees,
    isLoadingPartnerList,
    partnerError,
    fetchPartnerAttendeesList
  } = useAttendee();

  useFocusEffect(
    React.useCallback(() => {
      if (userId && eventId) {
        handleRefresh();
      }
    }, [userId, eventId])
  );

  const handleRefresh = async () => {
    if (!userId || !eventId) return;
    
    try {
      setRefreshing(true);
      await fetchPartnerAttendeesList({
        userId: userId,
        eventId: eventId
      });
    } catch (error) {
      console.error('Error refreshing partner attendees:', error);
    } finally {
      setRefreshing(false);
    }
  };

  

  const handleGoBack = () => navigation.goBack();

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        onLeftPress={handleGoBack}
        onRightPress={handleRefresh}
        title={eventName || 'Participants'}
        RightIcon={Icons.refresh}
        rightBottonColor = {colors.green}
        size = {30}
      />

      <View style={styles.container}>

        <CommonAttendeeList
          searchQuery={''}
          attendees={partnerAttendees.map(mapPartnerAttendeeToAttendee)}
          isLoading={isLoadingPartnerList}
          error={!!partnerError}
          handleRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    top: 10,
  },
});

export default PartnerAttendeesListScreen;