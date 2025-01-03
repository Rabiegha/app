import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import colors from '../../../assets/colors/colors';

export default function ErrorView({error, handleRetry}) {
  return (
    <View style={styles.container}>
      <Text>Error: {error}</Text>
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text>hrhrh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {backgroundColor: colors.green},
});
