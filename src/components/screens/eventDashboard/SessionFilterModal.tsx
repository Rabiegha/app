import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import Icons from '../../../assets/images/icons';
import { useSessionLocations } from '../../../hooks/sessions/useSessionLocations';
import { SessionStatus } from '../../../utils/date/sessionDateUtils';

const { height } = Dimensions.get('window');

interface SessionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  searchQuery: string;
  selectedLocation: string | null;
  selectedDate: string | null;
  selectedStatus?: SessionStatus | null;
  selectedHoraire?: string | null;
  onApplyFilters: (filters: {
    selectedLocation: string | null;
    selectedDate: string | null;
    selectedStatus: SessionStatus | null;
    selectedHoraire: string | null;
  }) => void;
}

const SessionFilterModal = ({
  visible,
  onClose,
  searchQuery: _searchQuery,
  selectedLocation: initialLocation,
  selectedDate: initialDate,
  selectedStatus: initialStatus = null,
  selectedHoraire: initialHoraire = null,
  onApplyFilters,
}: SessionFilterModalProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(initialLocation);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | null>(initialStatus);
  const [selectedHoraire, setSelectedHoraire] = useState<string | null>(initialHoraire);
  const [animation] = useState(new Animated.Value(height));
  const { locations, dates, loading } = useSessionLocations();

  useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: height,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  useEffect(() => {
    setSelectedLocation(initialLocation);
    setSelectedDate(initialDate);
    setSelectedStatus(initialStatus);
    setSelectedHoraire(initialHoraire);
  }, [initialDate, initialLocation, initialStatus, initialHoraire]);

  const handleApplyFilters = () => {
    onApplyFilters({
      selectedLocation,
      selectedDate,
      selectedStatus,
      selectedHoraire,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedLocation(null);
    setSelectedDate(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: animation }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtrer les sessions</Text>
            <TouchableOpacity onPress={onClose}>
              <Image
                source={Icons.Fermer}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Liste des emplacements */}
          <Text style={styles.sectionTitle}>Filtre par emplacement</Text>
          <FlatList
            data={locations}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterItem, selectedLocation === item && styles.selectedItem]}
                onPress={() => setSelectedLocation(item === selectedLocation ? null : item)}
              >
                <Text style={styles.filterItemText}>{item}</Text>
                {selectedLocation === item && (
                  <Image source={Icons.Checked} style={styles.checkmark} />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={loading ? <Text style={styles.emptyText}>Chargement...</Text> : <Text style={styles.emptyText}>Aucun emplacement disponible</Text>}
            style={styles.filterList}
          />

          {/* Liste des dates */}
          <Text style={styles.sectionTitle}>Filtre par date</Text>
          <FlatList
            data={dates}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filterItem, selectedDate === item && styles.selectedItem]}
                onPress={() => setSelectedDate(item === selectedDate ? null : item)}
              >
                <Text style={styles.filterItemText}>{item}</Text>
                {selectedDate === item && <Image source={Icons.Checked} style={styles.checkmark} />}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={loading ? <Text style={styles.emptyText}>Chargement...</Text> : <Text style={styles.emptyText}>Aucune date disponible</Text>}
            style={styles.filterList}
          />

          {/* Liste des statuts de session */}
          <Text style={styles.sectionTitle}>Filtre par statut</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[styles.statusItem, selectedStatus === SessionStatus.UPCOMING && styles.selectedStatusItem]}
              onPress={() => setSelectedStatus(selectedStatus === SessionStatus.UPCOMING ? null : SessionStatus.UPCOMING)}
            >
              <Text style={[styles.statusText, selectedStatus === SessionStatus.UPCOMING && styles.selectedStatusText]}>À venir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusItem, selectedStatus === SessionStatus.FUTURE && styles.selectedStatusItem]}
              onPress={() => setSelectedStatus(selectedStatus === SessionStatus.FUTURE ? null : SessionStatus.FUTURE)}
            >
              <Text style={[styles.statusText, selectedStatus === SessionStatus.FUTURE && styles.selectedStatusText]}>Programmée</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.statusItem, selectedStatus === SessionStatus.PAST && styles.selectedStatusItem]}
              onPress={() => setSelectedStatus(selectedStatus === SessionStatus.PAST ? null : SessionStatus.PAST)}
            >
              <Text style={[styles.statusText, selectedStatus === SessionStatus.PAST && styles.selectedStatusText]}>Passée</Text>
            </TouchableOpacity>
          </View>

          {/* Filtre par horaire */}
          <Text style={styles.sectionTitle}>Filtre par horaire</Text>
          <View style={styles.horaireContainer}>
            <TouchableOpacity
              style={[styles.horaireItem, selectedHoraire === 'matin' && styles.selectedHoraireItem]}
              onPress={() => setSelectedHoraire(selectedHoraire === 'matin' ? null : 'matin')}
            >
              <Text style={[styles.horaireText, selectedHoraire === 'matin' && styles.selectedHoraireText]}>Matin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.horaireItem, selectedHoraire === 'midi' && styles.selectedHoraireItem]}
              onPress={() => setSelectedHoraire(selectedHoraire === 'midi' ? null : 'midi')}
            >
              <Text style={[styles.horaireText, selectedHoraire === 'midi' && styles.selectedHoraireText]}>Midi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.horaireItem, selectedHoraire === 'soir' && styles.selectedHoraireItem]}
              onPress={() => setSelectedHoraire(selectedHoraire === 'soir' ? null : 'soir')}
            >
              <Text style={[styles.horaireText, selectedHoraire === 'soir' && styles.selectedHoraireText]}>Soir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.darkGrey,
  },
  closeButton: {
    padding: 10,
  },
  closeIcon: {
    width: 24,
    height: 24,
    tintColor: colors.darkGrey,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: colors.darkGrey,
  },
  filterList: {
    flexGrow: 0,
    maxHeight: 180,
    marginBottom: 15,
  },
  filterItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: colors.green,
  },
  filterItemText: {
    color: colors.darkGrey,
    fontSize: 14,
  },
  filterItemTextActive: {
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    marginBottom: 10,
    width: '30%',
    alignItems: 'center',
  },
  selectedStatusItem: {
    backgroundColor: colors.green,
  },
  statusText: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  selectedStatusText: {
    color: 'white',
    fontWeight: '600',
  },
  horaireContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  horaireItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.lightGrey,
    marginBottom: 10,
    width: '30%',
    alignItems: 'center',
  },
  selectedHoraireItem: {
    backgroundColor: colors.green,
  },
  horaireText: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  selectedHoraireText: {
    color: 'white',
    fontWeight: '600',
  },
  loadingText: {
    color: colors.darkGrey,
    fontStyle: 'italic',
    marginVertical: 10,
  },
  emptyText: {
    color: colors.darkGrey,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 10,
  },
  checkmark: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  buttonContainer: {
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: colors.green,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.green,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: colors.green,
    fontWeight: 'bold',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SessionFilterModal;
