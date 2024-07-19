import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../colors/colors';
import {useEvent} from '../context/EventContext';
import axios from 'axios';
import Share from 'react-native-share';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import MoreComponent from '../components/screens/MoreComponent';
import globalStyle from '../assets/styles/globalStyle';
import {BASE_URL, EMS_URL} from '../config/config';

const MoreScreen = ({route, navigation}) => {
  const {triggerListRefresh} = useEvent();

  const {
    eventId,
    attendeeId,
    firstName,
    lastName,
    email,
    phone,
    organization,
    attendeeStatus,
  } = route.params;
  console.log(firstName, lastName, email, attendeeStatus, organization);
  const [localAttendeeStatus, setLocalAttendeeStatus] =
    useState(attendeeStatus);

  const {itemName} = route.params || {};
  const handleBackPress = () => {
    navigation.goBack();
  };
  const handleBadgePress = () => {
    navigation.navigate('Badge', {
      attendeeId: attendeeId,
      eventId: eventId,
    });
  };
  const handleButton = async () => {
    console.log('handleButton appelé');
    // Calcul de `updatedStatus` basé sur `localAttendeeStatus` au lieu de `attendeeStatus`
    const updatedStatus = localAttendeeStatus === 0 ? 1 : 0;
    console.log(`Mise à jour du status : ${updatedStatus}`);

    // URL de l'API pour switcher le status
    const url = `${BASE_URL}/update_event_attendee_attendee_status/?event_id=${eventId}&attendee_id=${attendeeId}&attendee_status=${updatedStatus}`;

    triggerListRefresh();

    try {
      const response = await axios.post(url);

      if (response.data.status) {
        // Mise à jour de l'état local avec `updatedStatus`
        console.log('Avant la mise à jour :', localAttendeeStatus);
        setLocalAttendeeStatus(updatedStatus);
        console.log('Après la mise à jour :', localAttendeeStatus);
      } else {
        console.error(
          'Failed to update attendee status:',
          response.data.message,
        );
      }
    } catch (error) {
      console.error('Error updating attendee status:', error);
    }
  };

  const pdf = `${EMS_URL}/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;
  const sendPdf = async () => {
    try {
      const shareResponse = await Share.open({
        url: pdf,
        type: 'application/pdf',
      });
      console.log(shareResponse);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={'Profil'}
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
          organization={organization}
          attendeeStatus={localAttendeeStatus}
          handleButton={handleButton}
          Share={sendPdf}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profil: {
    marginTop: -20,
  },
});

export default MoreScreen;
