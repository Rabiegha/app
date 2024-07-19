// LabelValueComponent.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'; // Assuming you're using Expo for icons
import colors from '../../../colors/colors';

const LabelValueComponent = ({label, value, value2}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {value2}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
  },
  editButton: {
    marginLeft: 10,
  },
});

export default LabelValueComponent;
