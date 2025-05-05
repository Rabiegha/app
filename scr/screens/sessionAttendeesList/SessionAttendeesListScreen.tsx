import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View  } from 'react-native';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import {useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import useSessionRegistrationData from '../../hooks/registration/useSessionRegistrationSData';
import useFetchSessionAttendeeList from '../../hooks/attendee/useFetchSessionAttendeeList';
import SessionListAttendee from '../../components/screens/attendees/sessionAttendeeList/SessionAttendeeList';
import refreshIcon from '../../assets/images/icons/refresh.png';
import MainHeader from '../../components/elements/header/MainHeader';



const SessionAttendeesListScreen = () => {


    const route = useRoute();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const {capacity, totalCheckedIn} = useSessionRegistrationData({ refreshTrigger1: refreshTrigger });
    const { eventName } = route.params || {};


    const userId = useSelector(selectCurrentUserId);
    const {eventId} = useActiveEvent();

    const { attendees, isLoading, error, fetchData} = useFetchSessionAttendeeList(userId, eventId);

    const ratio = capacity > 0 ? (totalCheckedIn / capacity) * 100 : 0;

    useFocusEffect(
      React.useCallback(() => {
        fetchData();
      }, [userId, eventId])
    );


    const handleRefresh = async () => {
      try {
        setRefreshing(true);
        await fetchData();
        await setRefreshTrigger(prev => prev + 1);
      } finally {
        setRefreshing(false);
      }
    };

    const handleGoBack = () => {
      navigation.goBack();
    };


  return (
    <View style={[globalStyle.backgroundWhite]}>
      <MainHeader
        title={eventName}
        onLeftPress={handleGoBack}
      />
      
      <View style={styles.container}>
      {/* 🔁 Bouton de reload */}
      <TouchableOpacity style={styles.imageContainee} onPress={handleRefresh}>
        <Image style={styles.reloadImage} source={refreshIcon} />
      </TouchableOpacity>
      <SessionListAttendee
        searchQuery={''}
        ratio={ratio}
        capacity={capacity}
        totalCheckedIn={totalCheckedIn}
        attendees={attendees}
        isLoading={isLoading}
        error={error}
        handleRefresh={handleRefresh}
        refreshing= {refreshing}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
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
    top: 0,
    zIndex: 20,

  },
});


export default SessionAttendeesListScreen;
