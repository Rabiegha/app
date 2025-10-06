import React, {useState} from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useFocusEffect, useRoute, RouteProp} from '@react-navigation/native';

import ListEvents from '../../components/screens/events/ListEvents';
import globalStyle from '../../assets/styles/globalStyle';
import usePastEvents from '../../hooks/event/usePastEvents';
import EmptyView from '../../components/elements/view/EmptyView';
import ErrorView from '../../components/elements/view/ErrorView';
import LoadingView from '../../components/elements/view/LoadingView';
import {Event} from '../../types/event.types';

// Define types for the component props
interface PastEventsScreenProps {
  searchQuery?: string;
  onEventSelect?: (event: Event) => void; 
}

// Define the route params type
type PastEventsRouteParams = {
  searchQuery?: string;
  onEventSelect?: (event: Event) => void; 
};

const PastEventsScreen: React.FC<PastEventsScreenProps> = (props) => {
  const route = useRoute<RouteProp<Record<string, PastEventsRouteParams>, string>>();
  const [refreshing, setRefreshing] = useState(false);
  
  // Get props either directly or from route params
  const searchQuery = props.searchQuery || route.params?.searchQuery || '';
  const onEventSelect = props.onEventSelect || route.params?.onEventSelect || ((event) => {
    console.log('Event selected:', event);
    // Default implementation if no handler is provided
  });

  const {events, loading, error, clearData, refreshEvents} = usePastEvents();

  // Clear data and adjust status bar on focus
  useFocusEffect(
    React.useCallback(() => {
      clearData();
    }, [clearData]),
  );

  const handleRetry = () => {
    clearData();
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshEvents();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingView />;
  }
  if (error) {
    return <ErrorView handleRetry={handleRetry} />;
  }
  if (events) {
    if (events.length === 0) {
      return <EmptyView handleRetry={handleRetry} text={undefined}/>;
    }
  }

  const filteredEvents = (events ?? []).filter((event: Event) =>
    event.event_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.event_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
});

export default PastEventsScreen;
