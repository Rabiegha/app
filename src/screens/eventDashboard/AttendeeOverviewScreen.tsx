import { FlatList, StyleSheet, RefreshControl, View } from 'react-native';
import React, { useState } from 'react';
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import { useNavigation } from '@react-navigation/native';
import ListCard from '../../components/elements/ListCard';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import EmptyView from '../../components/elements/view/EmptyView';

const AttendeeOverviewScreen = () => {
  const navigation = useNavigation();

  const navigate = () => {
    navigation.navigate('AttendeesList');
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const { totalAttendees, totalCheckedIn } = useRegistrationData({ refreshTrigger1: refreshTrigger });

  const attendees = totalAttendees !== null
    ? [{ id: '1', total: totalAttendees, checkedIn: totalCheckedIn }]
    : [];

  // 🔄 Fonction déclenchée lors du pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1); // Cela trigger le hook
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  const renderItem = ({ item }) => (
    <ListCard
      title="Liste des participants"
      subtitle1={`${item.total} Total | ${item.checkedIn} Enregistrés`}
      onPress={navigate}
      subtitle2={undefined}
    />
  );

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <FlatList
        data={attendees}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.green}
          />
        }
        ListEmptyComponent={
          <EmptyView handleRetry={handleRefresh} text="Aucun participant à afficher." />
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
});

export default AttendeeOverviewScreen;
