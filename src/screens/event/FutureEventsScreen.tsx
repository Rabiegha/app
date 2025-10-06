import React, {useState} from 'react';
import {View, StyleSheet, Text, SectionList, RefreshControl} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useRoute, RouteProp} from '@react-navigation/native';

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
  const [isClearing, setIsClearing] = useState(false);
  
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

  // Reset clearing state when data loads
  React.useEffect(() => {
    if (!loading && events) {
      setIsClearing(false);
    }
  }, [loading, events]);

  // Clear data and adjust status bar on focus
  useFocusEffect(
    React.useCallback(() => {
      setIsClearing(true);
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

  // Show loading if we're clearing data or if we have no data at all (first load)
  if (isClearing || (loading && (!events || events.length === 0))) {
    return <LoadingView />;
  }

  if (error && (!events || events.length === 0)) {
    return <ErrorView handleRetry={handleRetry} />;
  }

  if (events && events.length === 0 && !loading) {
    return <EmptyView handleRetry={handleRetry} text={undefined}/>;
  }

  const handleSelectEvent = (event: Event) => {
    onEventSelect(event);
  };

  return (
    <SafeAreaView style={[styles.container, globalStyle.backgroundWhite]} edges={['bottom']}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.event_id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.listContainer}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  listContainer: {
    paddingBottom: 20,
  },
  futureSectionHeader: {
    marginTop: 20,
  },
  sectionHeader: {
    backgroundColor: colors.white,
  },
  sectionHeaderText: {
    color: colors.darkGrey,
    fontSize: 21,
    fontWeight: '800',
    paddingVertical: 10,
  },
});

export default FutureEventsScreen;
