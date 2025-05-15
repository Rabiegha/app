import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {CheckBox} from 'react-native-elements';
import colors from '../../assets/colors/colors';
import CheckedIcon from '../../assets/images/icons/Checked.png';

const CheckBoxComponent = ({key, isChecked, onPress, title}) => {
  return (
    <CheckBox
      key={key}
      title={title}
      checked={isChecked}
      checkedIcon={
        <Image
          source={CheckedIcon}
          resizeMode="contain"
          style={{
            width: 20,
            height: 20,
            tintColor: colors.greyCream,
          }}
        />
      }
      onPress={onPress}
    />
  );
};

export default CheckBoxComponent;
