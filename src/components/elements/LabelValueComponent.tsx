// LabelValueComponent.tsx
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import colors from '../../assets/colors/colors';
import Icons from '../../assets/images/icons'

interface LabelValueComponentProps {
  label: string;
  value: string | number;
  value2?: string | number;
  showButton?: boolean;
  modifyHandle?: () => void;
}

const LabelValueComponent = ({label, value, value2, showButton, modifyHandle}: LabelValueComponentProps) => {
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
            style={styles.editButton}>
              <Image source={Icons.Modifier} style={styles.buttonImage} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonImage: {
    height: 30,
    tintColor: colors.darkGrey,
    width: 25,
    zIndex: 2,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 5
  },
  editButton: {
    height: 23,
    marginRight: 17,
    width: 15,
    zIndex: 2,

  },
  label: {
    color: colors.darkGrey,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    color: colors.darkGrey,
    fontSize: 12,
  },
});

export default LabelValueComponent;
