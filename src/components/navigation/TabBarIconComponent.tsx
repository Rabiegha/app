import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import colors from '../../assets/colors/colors';
import { TabBarIconProps } from './TabBarIconComponent.types';

/**
 * Component for rendering tab bar icons with optional labels
 */
export function TabBarIcon({ icon, label, focused, height = 24, width = 24, style }: TabBarIconProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[
          styles.icon,
          {
            tintColor: focused ? colors.green : colors.greyCream,
            height,
            width,
          }
        ]}
      />
      {label ? (
        <Text style={[styles.label, { color: focused ? colors.green : colors.greyCream }]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

/**
 * Styles for the TabBarIcon component
 */
const styles = StyleSheet.create<{
  container: ViewStyle;
  icon: ImageStyle;
  label: TextStyle;
}>({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
