// FiltreDetailsComponent.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import colors from '../../assets/colors/colors';
import CompaniesFilterComponent from './CompaniesFilterComponent';
import { FiltreDetailsComponentProps, StatusOption } from './FiltreDetailsComponent.types';

/**
 * Component for displaying and selecting filter options
 */
const FiltreDetailsComponent: React.FC<FiltreDetailsComponentProps> = ({
  filterCriteria,
  setFilterCriteria,
  tout,
  checkedIn,
  notChechkedIn,
  style,
}) => {
  const statusOptions: StatusOption[] = [
    { status: 'all', label: `Tous les participants (${tout || 0})` },
    { status: 'checked-in', label: `Checked In (${checkedIn || 0})` },
    { status: 'not-checked-in', label: `Not Checked In (${notChechkedIn || 0})` },
  ];

  const handleStatusPress = (newStatus: string): void => {
    setFilterCriteria(prev => ({
      ...prev,
      status: newStatus,
    }));
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>États</Text>
      <View style={styles.optionsContainer}>
        {statusOptions.map(({ status, label }) => (
          <TouchableOpacity
            key={status}
            style={styles.option}
            onPress={() => handleStatusPress(status)}
          >
            <View
              style={[
                styles.checkbox,
                filterCriteria.status === status && styles.checked,
              ]}
            />
            <Text style={styles.optionText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Companies Filter 
      <CompaniesFilterComponent
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
      /> */}
    </View>
  );
};

export default FiltreDetailsComponent;

/**
 * Styles for the FiltreDetailsComponent
 */
const styles = StyleSheet.create<{
  container: ViewStyle;
  title: TextStyle;
  optionsContainer: ViewStyle;
  option: ViewStyle;
  checkbox: ViewStyle;
  checked: ViewStyle;
  optionText: TextStyle;
}>({
  container: {
    backgroundColor: colors.darkerGrey,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.greyCream,
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.greyCream,
    marginRight: 10,
  },
  checked: {
    backgroundColor: colors.greyCream,
  },
  optionText: {
    color: colors.greyCream,
    fontSize: 12,
  },
});
