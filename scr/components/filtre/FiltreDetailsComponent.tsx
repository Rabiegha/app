import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../assets/colors/colors';

// Import our new sub-component
import CompaniesFilterComponent from './CompaniesFilterComponent';

const FiltreDetailsComponent = ({
  filterCriteria,
  setFilterCriteria,
  tout,
  checkedIn,
  notChechkedIn,
}) => {
  // 1. Existing status options
  const statusOptions = [
    { status: 'all', label: `Tous les participants (${tout})` },
    { status: 'checked-in', label: `Checked In (${checkedIn})` },
    { status: 'not-checked-in', label: `Not Checked In (${notChechkedIn})` },
  ];

  // 2. Handler for the status filter
  const handleStatusPress = (newStatus) => {
    setFilterCriteria((prev) => ({
      ...prev,
      status: newStatus,
    }));
  };

  return (
    <View style={styles.container}>
      {/* ----- Section 1: Status Filters (États) ----- */}
      <Text style={styles.title}>États</Text>
      <View style={styles.optionsContainer}>
        {statusOptions.map(({ status, label }, idx) => (
          <TouchableOpacity
            key={idx}
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

      {/* ----- Section 2: Companies Filter (Separate Component) ----- */}
      <CompaniesFilterComponent
        filterCriteria={filterCriteria}
        setFilterCriteria={setFilterCriteria}
      />
    </View>
  );
};

export default FiltreDetailsComponent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.darkerGrey,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.greyCream,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'column',
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
