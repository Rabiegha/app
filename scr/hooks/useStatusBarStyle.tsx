import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import React from 'react';


export default function useStatusBarStyle(style = 'dark-content') {
    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setBarStyle(style);
            return () => {
                StatusBar.setBarStyle('default');
            };
        }, [style])
    );
}
