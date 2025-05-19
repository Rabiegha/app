import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Text, SectionList, RefreshControl} from 'react-native';
import {useFocusEffect, useRoute, RouteProp, ParamListBase} from '@react-navigation/native';

import ListEvents from '../../components/screens/events/ListEvents';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';

import useFilteredAndSectionedEvents from '../../hooks/event/useFilteredAndSectionedEvents';
import ErrorView from '../../components/elements/view/ErrorView';
import LoadingView from '../../components/elements/view/LoadingView';
import EmptyView from '../../components/elements/view/EmptyView';
import useFutureEvents from '../../hooks/event/useFutureEvents';
import {Event} from '../../types/event.types';

// Define types for the component props
interface FutureEventsScreenProps {
  searchQuery?: string;
  onEventSelect?: (event: Event) => void;
}

// Define the route params type
type FutureEventsRouteParams = {
  searchQuery?: string;
  onEventSelect?: (event: Event) => void;
};

const FutureEventsScreen: React.FC<FutureEventsScreenProps> = (props) => {
  const route = useRoute<RouteProp<Record<string, FutureEventsRouteParams>, string>>();
  const [refreshing, setRefreshing] = useState(false);
  
  // Get props either directly or from route params
  const searchQuery = props.searchQuery || route.params?.searchQuery || '';
  const onEventSelect = props.onEventSelect || route.params?.onEventSelect || ((event) => {
    console.log('Event selected:', event);
    // Default implementation if no handler is provided
  });

  const {events, loading, error, clearData, refreshEvents} = useFutureEvents();
  const {sections, eventsToday} = useFilteredAndSectionedEvents(
    events,
    searchQuery,
  );

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

  const handleSelectEvent = (event: Event) => {
    onEventSelect(event);
  };

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <SectionList
        sections={sections}
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
            onPress={() => handleSelectEvent(item)}
            eventDate={item.nice_start_datetime}
            eventType={item.event_type_name}
          />
        )}
        renderSectionHeader={({section}) => {
          const {title, isFutureSection} = section;
          const shouldApplyMargin = isFutureSection && eventsToday.length > 0;

          return (
            <View
              style={[
                styles.sectionHeader,
                shouldApplyMargin && styles.futureSectionHeader,
              ]}>
              {title ? (
                <Text style={styles.sectionHeaderText}>{title}</Text>
              ) : null}
            </View>
          );
        }}
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
  sectionHeader: {
    backgroundColor: 'white',
  },
  sectionHeaderText: {
    paddingVertical: 10,
    fontSize: 21,
    fontWeight: '800',
    color: colors.darkGrey,
  },
  futureSectionHeader: {
    marginTop: 20,
  },
});

export default FutureEventsScreen;
