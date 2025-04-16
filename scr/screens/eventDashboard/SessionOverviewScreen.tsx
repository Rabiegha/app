import { FlatList, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import ListCard from '../../components/elements/ListCard';
import { useSelector } from 'react-redux';
import {useEvent} from '../../context/EventContext';
import { getSessionsList } from '../../services/getSessionsListService';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors';
import { useNavigation } from '@react-navigation/native';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';
import EmptyView from '../../components/elements/view/EmptyView';

const  SessionOverviewScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState([]);

    const navigation = useNavigation();
    const userId = useSelector(selectCurrentUserId);
    const {eventId}  = useEvent();

    useEffect(() => {
      const fetchSessions = async () => {
        try {
          const response = await getSessionsList(userId, eventId);
          setSessions(response.data); // ou .event_child_list selon ta structure API
        } catch (error) {
          console.log('Erreur lors de la récupération des sessions :', error);
        }
      };

      fetchSessions();
    }, [userId, eventId]);


    const handlePress = () => {
      navigation.navigate('SessionAttendeesList');
    };

  const renderItem = ({ item }) => (
    <ListCard
      title = {item.event_name}
      subtitle1= {item.nice_start_datetime}
      subtitle2="Capacity 10 | Checked 0"
      onPress={handlePress}/>

  );


/*   if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView handleRetry={undefined} />;
  }

  if (sessions) {
    if (sessions.length === 0) {
      return <EmptyView handleRetry={undefined}/>;
    }
  }
 */

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <FlatList
          data={sessions}
          keyExtractor={item => item.id}
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

export default SessionOverviewScreen;
