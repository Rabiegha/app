import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../../assets/colors/colors';

export function TabBarIcon({ icon, label, focused, height = 24, width = 24 }) {
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 8,
    marginTop: 2,
  },
});
