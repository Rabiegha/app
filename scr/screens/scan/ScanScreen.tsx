import {View, Text, StatusBar} from 'react-native';
import ScanComponent from '../../components/screens/ScanComponent.tsx';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';

const QRCodeScannerScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('light-content'); // Set status bar style to light-content
      return () => {
        StatusBar.setBarStyle('default'); // Reset status bar style when screen loses focus
      };
    }, []),
  );
  return (
    <View style={{flex: 1}}>
      <ScanComponent />
    </View>
  );
};

export default QRCodeScannerScreen;
