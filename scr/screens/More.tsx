import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import axios from 'axios';
import Share from 'react-native-share';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import MoreComponent from '../components/screens/MoreComponent';
import globalStyle from '../assets/styles/globalStyle';
import colors from '../assets/colors/colors';
import {BASE_URL, EMS_URL} from '../config/config';
import {useEvent} from '../context/EventContext';

const MoreScreen = ({route, navigation}) => {
  const {triggerListRefresh, updateAttendee} = useEvent();

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
  } = route.params;

  const [localAttendeeStatus, setLocalAttendeeStatus] =
    useState(attendeeStatus);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effect to trigger list refresh when localAttendeeStatus changes
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
    };
    updateAttendee(eventId, updatedAttendee);
    triggerListRefresh();
  }, [localAttendeeStatus]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleBadgePress = () => {
    navigation.navigate('Badge', {
      attendeeId: attendeeId,
      eventId: eventId,
    });
  };

  const handleButton = async status => {
    console.log('handleButton called');
    setLoading(true);
    console.log(`Updating status to: ${status}`);

    const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${eventId}&attendee_id=${attendeeId}&attendee_status=${status}`;

    try {
      const response = await axios.post(url);

      if (response.data.status) {
        console.log('Before updating local state:', localAttendeeStatus);
        setLocalAttendeeStatus(status);
        console.log('After updating local state:', status);
      } else {
        console.error(
          'Failed to update attendee status:',
          response.data.message,
        );
      }
    } catch (error) {
      console.error('Error updating attendee status:', error);
    } finally {
      setLoading(false);
    }
  };

  const pdf = `${EMS_URL}/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;

  const sendPdf = async () => {
    try {
      await Share.open({
        url: pdf,
        type: 'application/pdf',
      });
    } catch (error) {
      console.error(error);
    }
  };
  const goToEdit = () => {
    navigation.navigate('Edit', {
      attendeeId: attendeeId,
      eventId: eventId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      jobTitle: jobTitle,
      organization: organization,
      type: type,
      typeId: typeId,
    });
  };

  useEffect(() => {
    console.log('', type);
  }, [type]);

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={'Print'}
        handlePress={handleBackPress}
        color={colors.darkGrey}
      />
      <View style={[globalStyle.container, styles.profil]}>
        <MoreComponent
          See={handleBadgePress}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          JobTitle={jobTitle}
          attendeeStatus={localAttendeeStatus}
          organization={organization}
          handleButton={handleButton}
          share={sendPdf}
          loading={loading}
          modify={goToEdit}
          type={type}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profil: {
    marginTop: -20,
    height: 1500,
  },
});

export default MoreScreen;
