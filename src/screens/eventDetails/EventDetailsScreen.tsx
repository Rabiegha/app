import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {EventDetailsStackParamList} from '../../navigation/tabNavigator/EventDetailsNavigator';

import globalStyle from '../../assets/styles/globalStyle';
import EventDetailsComponent from '../../components/screens/EventDetailsComponent';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import MainHeader from '../../components/elements/header/MainHeader';
import colors from '../../assets/colors/colors';

const EventDetailsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<EventDetailsStackParamList, 'EventDetailsScreen'>>();
  const {summary, loading, error} = useRegistrationData({refreshTrigger1: 1});
  const totalAttendees = summary.totalAttendees;
  const totalCheckedIn = summary.totalCheckedIn;
  const totalNotCheckedIn = summary.totalNotCheckedIn;
  const goBack = () => {
    navigation.goBack();
  };

  const handlePress = (dataType: string) => {
    let state;
    let total;
    switch (dataType) {
      case 'registered':
        state = 'registered';
        total = totalAttendees;
        break;
      case 'attended':
        state = 'attended';
        total = totalCheckedIn;
        break;
      case 'not_attended':
        state = 'not_attended';
        total = totalNotCheckedIn;
        break;
      default:
        state = null;
        total = null;
    }

    // Properly navigate to the screen within the same navigator
    navigation.navigate('EventDetailsPerTypeScreen', {state, total});
  };

  return (
    <SafeAreaView style={globalStyle.backgroundWhite}>
      <View style={styles.headerWrapper}>
        <MainHeader
          title={'Details'}
          onLeftPress={goBack}
        />
      </View>
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.green} />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <EventDetailsComponent
            totalAttendees={totalAttendees}
            totalCheckedIn={totalCheckedIn}
            totalNotCheckedIn={totalNotCheckedIn}
            totalAttendeesAction={() => handlePress('registered')}
            checkedInAction={() => handlePress('attended')}
            notCheckedOInAction={() => handlePress('not_attended')}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Define styles for the component with proper type safety
const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: colors.white,
    flex: 1,
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  errorText: {
    color: colors.red,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  headerWrapper: {
    borderBottomColor: colors.greyCream,
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
});

export default EventDetailsScreen;
