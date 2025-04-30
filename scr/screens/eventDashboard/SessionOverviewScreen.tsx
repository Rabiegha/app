import { FlatList, StyleSheet, RefreshControl, View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import ListCard from '../../components/elements/ListCard';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../../context/EventContext';
import { getSessionsList } from '../../services/getSessionsListService';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';
import EmptyView from '../../components/elements/view/EmptyView';
import { useSessionSelector } from '../../utils/session/useSessionSelector';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import colors from '../../assets/colors/colors';

const SessionOverviewScreen = () => {
  const navigation = useNavigation();
  const [sessions, setSessions] = useState([]);
  const { eventId } = useEvent();
  const userId = useSelector(selectCurrentUserId);
  const selectSession = useSessionSelector();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { capacity, totalCheckedIn } = useRegistrationData({ refreshTrigger1: refreshTrigger });

  const fetchSessions = async () => {
    try {
      setError(false);
      const response = await getSessionsList(userId, eventId);
      setSessions(response.data); // ou .event_child_list selon ton API
    } catch (error) {
      console.log('Erreur lors de la récupération des sessions :', error);
      setError(true);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    await fetchSessions();
    setRefreshing(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchSessions().finally(() => setLoading(false));
  }, [userId, eventId]);

  const handleSessionSelect = (session) => {
    selectSession(session);
    navigation.navigate('SessionAttendeesList', {
      capacity: session.capacity,
      eventName: session.event_name,
    });
  };

  const renderItem = ({ item }) => (
    <ListCard
      title={item.event_name}
      subtitle1={item.nice_start_datetime}
      subtitle2={`Capacity ${item.capacity}`}
      onPress={() => handleSessionSelect(item)}
    />
  );

  if (loading && !refreshing) return <LoadingView />;
  if (error) return <ErrorView handleRetry={fetchSessions} />;

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.event_id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#2ecc71"
          />
        }
        contentContainerStyle={{
          paddingBottom: 250, // 🟢 Important for scrolling above bottom navbar
          flexGrow: sessions.length === 0 ? 1 : undefined,
          minHeight: sessions.length === 0 ? 500 : undefined,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune session enregistrée</Text>
            <TouchableOpacity style={styles.button} onPress={handleRefresh}>
              <Text style={styles.buttonTexte}>Reload</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
  },
  emptyText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.green,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonTexte: {color: 'white'},
});

export default SessionOverviewScreen;
