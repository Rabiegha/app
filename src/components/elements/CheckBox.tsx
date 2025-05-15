import React from 'react';
import { Image, ImageStyle } from 'react-native';
import { CheckBox, CheckBoxProps as RNECheckBoxProps } from 'react-native-elements';
import colors from '../../assets/colors/colors';
import Icons from '@/assets/images/icons';
import { CheckBoxProps } from './CheckBox.types';

/**
 * Custom checkbox component using react-native-elements
 */

const CheckBoxComponent: React.FC<CheckBoxProps> = ({
  isChecked,
  onPress,
  title,
  style
}) => {
  return (
    <CheckBox
      title={title}
      checked={isChecked}
      checkedIcon={
        <Image
          source={Icons.Checked}
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
