import { FlatList, StyleSheet, RefreshControl, View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

import globalStyle from '../../assets/styles/globalStyle';
import ListCard from '../../components/elements/ListCard';
import { useEvent } from '../../context/EventContext';
import { getSessionsList } from '../../services/getSessionsListService';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';
import { useSessionSelector } from '../../utils/session/useSessionSelector';
import useRegistrationData from '../../hooks/registration/useRegistrationData';
import colors from '../../assets/colors/colors';
import { Session, SessionNavigationParams } from '../../types/session';
import Search from '../../components/elements/Search';
import Icons from '../../assets/images/icons';
import FloatingSearchButton from '../../components/screens/eventDashboard/FloatingSearchButton';
import SessionFilterModal from '../../components/screens/eventDashboard/SessionFilterModal';
import { SessionStatus, getSessionStatus, sortSessionsByStatus } from '../../utils/date/sessionDateUtils';

const SessionOverviewScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const { eventId } = useEvent();
  const userId = useSelector(selectCurrentUserId);
  const selectSession = useSessionSelector();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | null>(null);
  const [selectedHoraire, setSelectedHoraire] = useState<string | null>(null);

  useRegistrationData({ refreshTrigger1: refreshTrigger });

  const fetchSessions = useCallback(async () => {
    try {
      setError(false);
      // Check if userId and eventId are available before making the API call
      if (!userId || !eventId) {
        console.log('User ID or Event ID not available, skipping session fetch');
        setSessions([]);
        setAllSessions([]);
        return;
      }

      const response = await getSessionsList(userId, eventId);
      setAllSessions(response.data);
      setSessions(response.data);
    } catch (err) {
      console.log('Erreur lors de la récupération des sessions :', err);
      setError(true);
    }
  }, [userId, eventId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    await fetchSessions();
    setRefreshing(false);
  };

  useEffect(() => {
    // Only fetch sessions if both userId and eventId are available
    if (userId && eventId) {
      setLoading(true);
      fetchSessions().finally(() => setLoading(false));
    } else {
      // Reset sessions if user is not logged in or no event is selected
      setSessions([]);
      setAllSessions([]);
      setLoading(false);
    }
  }, [userId, eventId, fetchSessions]);

  // Filter sessions based on search query and filters
  useEffect(() => {
    if (!allSessions || allSessions.length === 0) {
      return;
    }

    let filteredSessions = [...allSessions];

    // Apply search filter
    if (searchQuery) {
      filteredSessions = filteredSessions.filter(session => {
        return session.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (session.location && session.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
          session.nice_start_datetime.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply location filter
    if (selectedLocation) {
      filteredSessions = filteredSessions.filter(session => {
        return session.location === selectedLocation;
      });
    }
  
    // Apply status filter
    if (selectedStatus) {
      filteredSessions = filteredSessions.filter(session => {
        return getSessionStatus(session) === selectedStatus;
      });
    }
  
    // Apply horaire (time slot) filter
    if (selectedHoraire) {
      filteredSessions = filteredSessions.filter(session => {
        // Get time part from nice_start_datetime (e.g. "29/04/2025 12:00 AM")
        const timePart = session.nice_start_datetime?.split(' ')[1] + ' ' + session.nice_start_datetime?.split(' ')[2];
        return timePart === selectedHoraire;
      });
    }
  
    // Sort sessions - upcoming ones first, then future ones, then past ones
    const sortedSessions = sortSessionsByStatus(filteredSessions);
    setSessions(sortedSessions);
  }, [allSessions, searchQuery, selectedLocation, selectedStatus, selectedHoraire]);

  const handleSessionSelect = (session: Session) => {
    selectSession(session);
    navigation.navigate('SessionAttendeesList', {
      capacity: session.capacity,
      eventName: session.event_name,
    } as SessionNavigationParams);
  };

  const renderItem = ({ item }: { item: Session }) => {
    // Utiliser toujours le ListCard pour une cohérence visuelle
    const status = getSessionStatus(item);
    return (
      <ListCard
        title={item.event_name}
        subtitle1={item.nice_start_datetime}
        subtitle2={`${item.location ? `${item.location} • ` : ''}Capacity ${item.capacity}`}
        searchQuery={searchQuery}
        onPress={() => handleSessionSelect(item)}
        sessionStatus={status}
      />
    );
  };

  const handleOpenFilterModal = () => {
    setFilterModalVisible(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalVisible(false);
  };

  const handleApplyFilters = (filters: {
    selectedLocation: string | null;
    selectedStatus: SessionStatus | null;
    selectedHoraire: string | null;
  }) => {
    setSelectedLocation(filters.selectedLocation);
    setSelectedStatus(filters.selectedStatus);
    setSelectedHoraire(filters.selectedHoraire);
  };

  if (loading && !refreshing) {
    return <LoadingView />;
  }
  if (error) {
    return <ErrorView handleRetry={fetchSessions} />;
  }

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <Search
        onChange={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {searchQuery && (
        <TouchableOpacity 
          style={styles.resetSearchButton} 
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.resetSearchButtonText}>Effacer recherche</Text>
        </TouchableOpacity>
      )}

      <View style={styles.filterChipsContainer}>
        {selectedLocation && (
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setSelectedLocation(null)}
          >
            <Text style={styles.filterChipText}>{selectedLocation}</Text>
            <Image source={Icons.Fermer} style={styles.filterChipIcon} />
          </TouchableOpacity>
        )}

        {/* Filtre par date supprimé */}
      
        {selectedStatus && (
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setSelectedStatus(null)}
          >
            <Text style={styles.filterChipText}>{selectedStatus}</Text>
            <Image source={Icons.Fermer} style={styles.filterChipIcon} />
          </TouchableOpacity>
        )}
      
        {selectedHoraire && (
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setSelectedHoraire(null)}
          >
            <Text style={styles.filterChipText}>{selectedHoraire}</Text>
            <Image source={Icons.Fermer} style={styles.filterChipIcon} />
          </TouchableOpacity>
        )}
      </View>
    
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
          paddingBottom: 250, // Important for scrolling above bottom navbar
          flexGrow: sessions.length === 0 ? 1 : undefined,
          minHeight: sessions.length === 0 ? 500 : undefined,
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedLocation || selectedStatus || selectedHoraire
                ? 'No sessions match your filters'
                : 'Aucune session enregistrée'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleRefresh}>
              <Text style={styles.buttonTexte}>Reload</Text>
            </TouchableOpacity>
            {(searchQuery || selectedLocation || selectedStatus || selectedHoraire) && (
              <TouchableOpacity
                style={[styles.button, styles.resetButton]}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedLocation(null);
                  setSelectedStatus(null);
                  setSelectedHoraire(null);
                }}
              >
                <Text style={styles.buttonTexte}>Reset Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    
      <FloatingSearchButton onPress={handleOpenFilterModal} icon={Icons.Rechercher} />
    
      <SessionFilterModal
        visible={filterModalVisible}
        onClose={handleCloseFilterModal}
        searchQuery={searchQuery}
        selectedLocation={selectedLocation}
        selectedStatus={selectedStatus}
        selectedHoraire={selectedHoraire}
        onApplyFilters={handleApplyFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 20,
  },
  buttonTexte: {color: colors.white},
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  emptyText: {
    color: colors.darkGrey,
    fontSize: 16,
    textAlign: 'center',
  },
  filterChip: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 20,
    flexDirection: 'row',
    marginBottom: 8,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipIcon: {
    height: 12,
    tintColor: colors.white,
    width: 12,
  },
  filterChipText: {
    color: colors.white,
    fontSize: 12,
    marginRight: 5,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: colors.darkGrey,
    marginTop: 10,
  },
  resetSearchButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  resetSearchButtonText: {
    color: colors.green,
    fontSize: 14,
  },
  searchBar: {
    marginBottom: 15,
    marginTop: 10,
  },
});

export default SessionOverviewScreen;
