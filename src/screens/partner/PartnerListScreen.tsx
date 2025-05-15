import React, {useState} from 'react';
import {
    Text,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../assets/colors/colors';
import {useNavigation, useFocusEffect, useRoute, NavigationProp, ParamListBase, RouteProp} from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';
import {useActiveEvent} from '../../utils/event/useActiveEvent';
import Icons from '../../assets/images/icons';
import MainHeader from '../../components/elements/header/MainHeader';
import CommonAttendeeList from '../../components/elements/commonAttendeeList/CommonAttendeeList';
import useFetchPartnerAttendeeList from '../../hooks/attendee/useFetchPartnerList';
import { useEvent } from '../../context/EventContext';

interface EventContextType {
  eventId: number;
  eventName: string;
}

const PartnerAttendeesListScreen = () => {
  const route = useRoute<RouteProp<ParamListBase, string>>();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [refreshing, setRefreshing] = useState(false);

  const userId = useSelector(selectCurrentUserId);
  const {eventId, eventName} = useEvent() as EventContextType;
  const {attendees, isLoading, error, fetchData} = useFetchPartnerAttendeeList(userId, eventId);

  useFocusEffect(
    React.useCallback(() => {
      handleRefresh();
    }, [userId, eventId])
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  

  const handleGoBack = () => navigation.goBack();

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        onLeftPress={handleGoBack}
        onRightPress={handleRefresh}
        title={eventName || 'Participants'}
        RightIcon={Icons.refresh}
        rightBottonColor = {colors.green}
        size = {30}
      />

      <View style={styles.container}>

        <CommonAttendeeList
          searchQuery={''}
          attendees={attendees}
          isLoading={isLoading}
          error={error}
          handleRefresh={handleRefresh}
          refreshing={refreshing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    top: 10,
  },
});

export default PartnerAttendeesListScreen;