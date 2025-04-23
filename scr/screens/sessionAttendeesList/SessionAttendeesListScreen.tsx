import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View  } from 'react-native';
import HeaderComponent from '../../components/elements/header/HeaderComponent';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import Search from '../../components/elements/Search';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useActiveEvent } from '../../utils/event/useActiveEvent';
import ListItem from '../../components/screens/attendees/ListItem';
import { fetchSessionAttendees } from '../../redux/thunks/attendee/sessionAttendeesThunk';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';
import EmptyView from '../../components/elements/view/EmptyView';
import { fetchAttendeesList } from '../../services/getAttendeesListService';
import { useFocusEffect } from '@react-navigation/native';
import SessionStats from '../../components/screens/sessionAttendeeList/SessionStatsComponent';
import ProgressBar from '../../components/elements/progress/ProgressBar';
import { useRoute } from '@react-navigation/native';



const SessionAttendeesListScreen = () => {


    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const { capacity, eventName } = route.params || {};
    const scannedCount = attendees.filter(a => a.attendee_status == 1).length;
    const ratio = capacity > 0 ? (scannedCount / capacity) * 100 : 0;


    const userId = useSelector(selectCurrentUserId);
    const {eventId} = useActiveEvent();

    useFocusEffect(
      React.useCallback(() => {
        fetchAttendeeList();
      }, [userId, eventId])
    );



    const fetchAttendeeList = async () => {
      if (!userId || !eventId) {return;}
      try {
        setError(false);
        setIsLoading(true);
        const response = await fetchAttendeesList(userId, eventId, undefined, 1);
        setAttendees(response || []);
      } catch (err) {
        console.error('Error fetching session attendees', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
      fetchAttendeeList();
    }, [userId, eventId]);



    const handleRefresh = async () => {
      try {
        setRefreshing(true);
        await fetchAttendeeList();
      } finally {
        setRefreshing(false);
      }
    };


    // Navigate back
    const handleGoBack = () => {
      navigation.goBack();
    };

    // sessiion list fetch

      if (isLoading) {
        return <LoadingView />;
      }

      if (error) {return <ErrorView handleRetry={fetchAttendeeList} />;}
/*
  if (attendees.length === 0) {return <EmptyView handleRetry={fetchAttendeeList} />;} */


  return (
    <View style={[globalStyle.backgroundWhite]}>
      <HeaderComponent
        title={eventName}
        color={colors.darkGrey}
        handlePress={() => navigation.goBack()}
        backgroundColor={'white'}
      />
      <View style={globalStyle.container}>
      {/* <Search value={''} onChange={undefined} /> */}
      <SessionStats scannedCount={scannedCount} totalCount={capacity} />
      <ProgressBar progress={ratio} />
      <FlatList
          data={attendees}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ListItem item={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={
            attendees.length === 0
              ? { flexGrow: 1, minHeight: 500 } //
              : undefined
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun participant pour cette session.</Text>
            </View>
          }
        />

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100, // Pour que le scroll vers le bas fonctionne
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
  },
});


export default SessionAttendeesListScreen;
