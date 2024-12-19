import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import ListEvents from '../components/screens/events/ListEvents';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import useEventsData from '../hooks/event/useEventData';
import EmptyView from '../components/elements/View/EmptyView';
import ErrorView from '../components/elements/View/ErrorView';
import LoadingView from '../components/elements/View/LoadingView';

const EventPasseesScreen = ({searchQuery, onEventSelect}) => {
  const {events, loading, error, clearData} = useEventsData({
    isEventFromList: [0],
  });

  useFocusEffect(
    React.useCallback(() => {
      clearData();
      return () => {};
    }, [clearData]),
  );

  if (loading) {
    return <LoadingView />;
  }
  if (error) {
    return <ErrorView error={error} />;
  }
  if (!events || events.length === 0) {
    return <EmptyView />;
  }

  const filteredEvents = events.filter(event =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.event_id.toString()}
        renderItem={({item}) => (
          <ListEvents
            eventData={{
              event_name: item.event_name,
              ems_secret_code: item.ems_secret_code.toString(),
              event_id: item.event_id,
            }}
            searchQuery={searchQuery}
            onPress={() => onEventSelect(item)}
            eventDate={item.nice_start_datetime}
            eventType={item.event_type_name}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
});

export default EventPasseesScreen;
