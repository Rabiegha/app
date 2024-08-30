import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../../colors/colors';

const FiltreDetailsComponent = ({
  filterCriteria,
  setFilterCriteria,
  tout,
  checkedIn,
  notChechkedIn,
}) => {
  // This component now directly receives and updates filterCriteria

  const handleCheckboxPress = newStatus => {
    // Update filterCriteria based on selected status
    setFilterCriteria({status: newStatus});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Etats</Text>
      <View style={styles.optionsContainer}>
        {[
          {status: 'all', label: `Tous les participants (${tout})`},
          {status: 'checked-in', label: `Checked In (${checkedIn})`},
          {
            status: 'not-checked-in',
            label: `Not Checked In (${notChechkedIn})`,
          },
          // Add more objects here as needed
        ].map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.option}
            onPress={() => handleCheckboxPress(option.status)}>
            <View
              style={[
                styles.checkbox,
                filterCriteria.status == option.status && styles.checked,
              ]}
            />
            <Text style={styles.optionText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

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

export default FiltreDetailsComponent;
