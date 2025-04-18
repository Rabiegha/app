import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View  } from 'react-native';
import HeaderComponent from '../../components/elements/header/HeaderComponent';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import Search from '../../components/elements/Search';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { fetchAttendees } from '../../redux/slices/attendeesListSlice';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import { useEvent } from '../../context/EventContext';
import ListItem from '../../components/screens/attendees/ListItem';


const SessionAttendeesListScreen = () => {


    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);

    const userId = useSelector(selectCurrentUserId);
    const { sessionDetails } = useEvent(); // ou useActiveEvent si tu veux utiliser la fusion session/event
    const {eventId} = useActiveEvent;

    const { data: attendees, isLoading, error } = useSelector(state => state.attendees);


    useEffect(() => {
      if (userId && eventId) {
        dispatch(fetchAttendees({ userId, eventId, isDemoMode: false, attendeeStatus: 1 }));
      }
    }, [userId, eventId, dispatch]);


    const handleRefresh = async () => {
      if (!userId || !eventId) {return;}

      try {
        setRefreshing(true);
        await dispatch(fetchAttendees({ userId, eventId, isDemoMode: false, attendeeStatus: 1 })).unwrap();
      } catch (err) {
        console.error('Refresh failed', err);
      } finally {
        setRefreshing(false);
      }
    };


    // Navigate back
    const handleGoBack = () => {
      navigation.goBack();
    };

    // sessiion list fetch


  return (
    <View style={[globalStyle.backgroundWhite]}>
      <HeaderComponent
        title="Participants de la session"
        color={colors.darkGrey}
        handlePress={() => navigation.goBack()}
        backgroundColor={'white'}
      />
      <View style={globalStyle.container}>
        <Search value={''} onChange={undefined} />
        <FlatList
          data={attendees}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ListItem item={item} />
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({

});

export default SessionAttendeesListScreen;
