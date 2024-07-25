import React from 'react';
import {WebView} from 'react-native-webview';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import colors from '../../colors/colors';
import { useNavigation } from '@react-navigation/native';

const WebViewScreen = ({route}) => {
  const {url} = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      <WebView source={{uri: url}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'flex-stat',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#0000EE',
    fontSize: 16,
  },
});

export default WebViewScreen;
