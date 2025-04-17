import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import ListCard from '../../components/elements/ListCard';
import { useSelector } from 'react-redux';
import {useEvent} from '../../context/EventContext';
import { getSessionsList } from '../../services/getSessionsListService';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';
import EmptyView from '../../components/elements/view/EmptyView';
import { useEventSelector } from '../../utils/event/selectEvent';
import { useNavigation } from '@react-navigation/native';

const  SessionsListScreen = () => {

  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const {eventId, updateEventDetails} = useEvent();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const userId = useSelector(selectCurrentUserId);
  const selectEvent = useEventSelector();


  const fetchSessions = async () => {
    try {
      setError(false);
      setLoading(true);
      const response = await getSessionsList(userId, eventId);
      setSessions(response.data); // ou .event_child_list selon ta structure API
    } catch (error) {
      console.log('Erreur lors de la récupération des sessions :', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId, eventId]);

  const handleSessionSelect = (session) => {
    selectEvent(session);
    navigation.navigate('SessionAttendeesList');
  };

  const renderItem = ({ item }) => (
    <ListCard
      title = {item.event_name}
      subtitle1= {item.nice_start_datetime}
      subtitle2="Capacity 10 | Checked 0" onPress={() => handleSessionSelect(item)}/>

  );

  if (loading) {
    return (
      <LoadingView />
    );
  }
  if (error) {
    return (
      <ErrorView handleRetry={fetchSessions} />
    );
  }

  if (!loading && !error && sessions.length === 0) {
    return <EmptyView handleRetry={fetchSessions} />;
  }

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <FlatList
          data={sessions}
          keyExtractor={item => item.event_id}
          renderItem={renderItem}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
});

export default SessionsListScreen;
