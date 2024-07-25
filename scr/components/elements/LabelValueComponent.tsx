// LabelValueComponent.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'; // Assuming you're using Expo for icons
import colors from '../../../colors/colors';
import modifier from '../../../scr/assets/images/icons/Modifier.png';

const LabelValueComponent = ({label, value, value2, modifyDisplay, modify}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {value2}
        </Text>
      </View>
     {/*  <TouchableOpacity
        onPress={modify}
        style={[styles.editButton, {display: modifyDisplay}]}>
        <Image source={modifier} style={styles.buttonImage} />
      </TouchableOpacity> */}
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
  buttonImage: {
    width: 23,
    height: 23,
    tintColor: colors.darkGrey,
    zIndex: 2,
  },
  editButton: {
    marginRight: 17,
    width: 15,
    height: 23,
    zIndex: 2,
    display: 'none',
  },
});

export default LabelValueComponent;
