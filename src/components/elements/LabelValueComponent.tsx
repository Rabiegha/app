// LabelValueComponent.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import colors from '../../assets/colors/colors';
import Icons from '@/assets/images/icons';
import { LabelValueProps } from './LabelValueComponent.types';

/**
 * Component for displaying a label-value pair with an optional edit button
 */
const LabelValueComponent: React.FC<LabelValueProps> = ({
  label,
  value,
  value2,
  showButton,
  modifyHandle,
  style,
}) => {
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
            <Image source={Icons.Modifier} style={styles.buttonImage} />
      </TouchableOpacity>
        </>
      )}
    </View>
  );
};

/**
 * Styles for the LabelValueComponent
 */
const styles = StyleSheet.create<{
  container: ViewStyle;
  content: ViewStyle;
  label: TextStyle;
  value: TextStyle;
  buttonImage: ImageStyle;
  editButton: ViewStyle;
}>({
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
