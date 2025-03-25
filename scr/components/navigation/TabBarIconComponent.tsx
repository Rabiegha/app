import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import colors from '../../assets/colors/colors';

export function TabBarIcon({icon, label, focused, height, width}) {
  return (
    <View style={styles.navBarIcons}>
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          tintColor: focused ? colors.green : colors.greyCream,
          height: height,
          width: width,
        }}
      />
      {label ? (
        <Text
          style={[
            styles.label,
            {color: focused ? colors.green : colors.greyCream},
          ]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  navBarIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  label: {
    fontSize: 8,
  },
});
