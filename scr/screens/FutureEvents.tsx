import React from 'react';
import {View, StyleSheet, StatusBar, Text, SectionList} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import ListEvents from '../components/screens/events/ListEvents';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';

import useFilteredAndSectionedEvents from '../hooks/event/useFilteredAndSectionedEvents';
import ErrorView from '../components/elements/view/ErrorView';
import LoadingView from '../components/elements/view/LoadingView';
import EmptyView from '../components/elements/view/EmptyView';
import useFutureEvents from '../hooks/event/useFutureEvents';

const FutureEventsScreen = ({searchQuery, onEventSelect}) => {
  const {events, loading, error, clearData} = useFutureEvents();
  const {sections, eventsToday} = useFilteredAndSectionedEvents(
    events,
    searchQuery,
  );

  // Clear data and adjust status bar on focus
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
/*       clearData(); */
      return () => {
        StatusBar.setBarStyle('dark-content');
      };
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

  const handleSelectEvent = event => {
    onEventSelect(event);
  };

  return (
    <View style={[styles.container, globalStyle.backgroundWhite]}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.event_id.toString()}
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
