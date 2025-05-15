import React, { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View  } from 'react-native';
import colors from '../../assets/colors/colors';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import {useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import useSessionRegistrationData from '../../hooks/registration/useSessionRegistrationSData';
import useFetchSessionAttendeeList from '../../hooks/attendee/useFetchSessionAttendeeList';
import SessionListAttendee from '../../components/screens/attendees/sessionAttendeeList/SessionAttendeeList';
import Icons from '../../assets/images/icons';
import MainHeader from '../../components/elements/header/MainHeader';



interface RouteParams {
    eventName?: string;
}

const SessionAttendeesListScreen = () => {
    const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
    const navigation = useNavigation<NavigationProp<ParamListBase>>();
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
        handleRefresh();
      }, [userId, eventId])
    );


    const handleRefresh = async () => {
      try {
        setRefreshing(true);
        await fetchData();
        await setRefreshTrigger(p => p + 1);
      } finally {
        setRefreshing(false);
      }
    };

    const handleGoBack = () => {
      navigation.goBack();
    };

    const handleNavigationToScan = () => {
      navigation.navigate('ScanScreen', { scanType: 'session' } as never);
    };


  return (
    <View style={[globalStyle.backgroundWhite]}>
      <MainHeader
        color={colors.greyCream}
        onLeftPress={handleGoBack}
        leftButtonTintColor={colors.greyCream}
        backgroundColor={colors.cyan}
        title={eventName}
      />
      
      <View style={styles.container}>
      {/* 🔁 Bouton de reload */}
      <TouchableOpacity style={styles.imageContainee} onPress={handleRefresh}>
        <Image style={styles.reloadImage} source={Icons.refresh} />
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
      {/* ➕ Floating Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={handleNavigationToScan}>
        <Image source={Icons.Scan} style={styles.floatingIcon} />
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
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
    height: 40,
    width: 40,
    zIndex: 20,
    marginLeft: 'auto',
    top: 30,

  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  
    // ✅ Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  
    // ✅ Elevation for Android
    elevation: 25,
  
    zIndex: 10,
  },
  floatingIcon: {
    width: 50,
    height: 50,
    tintColor: 'white', // Optional: remove if you want the image in original color
  },
  
});


export default SessionAttendeesListScreen;
