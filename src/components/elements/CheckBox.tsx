import React from 'react';
import {Image} from 'react-native';
import {CheckBox} from 'react-native-elements';
import colors from '../../assets/colors/colors';
import Icons from '../../assets/images/icons';

interface CheckBoxComponentProps {
  key?: string | number;
  isChecked: boolean;
  onPress: () => void;
  title: string;
}

const CheckBoxComponent = ({key, isChecked, onPress, title}: CheckBoxComponentProps) => {
  return (
    <CheckBox
      key={key}
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
