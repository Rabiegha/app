// LabelValueComponent.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'; // Assuming you're using Expo for icons
import colors from '../../assets/colors/colors';
import modify from '../../assets/images/icons/Modifier.png'

const LabelValueComponent = ({label, value, value2, showButton, modifyHandle}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value} {value2}
        </Text>
      </View>

      {showButton && (
        <>
          <TouchableOpacity
            onPress={modifyHandle}
            style={[styles.editButton]}>
            <Image source={modify} style={styles.buttonImage} />
      </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 5
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.darkGrey,
  },
  value: {
    fontSize: 12,
    color: colors.darkGrey,
  },
  buttonImage: {
    width: 25,
    height: 30,
    tintColor: colors.darkGrey,
    zIndex: 2,
  },
  editButton: {
    marginRight: 17,
    width: 15,
    height: 23,
    zIndex: 2,

  },
});

export default LabelValueComponent;
