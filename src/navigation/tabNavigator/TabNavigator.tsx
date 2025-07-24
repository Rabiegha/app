import React, { useState, ReactElement } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarIcon } from '../../components/navigation/TabBarIconComponent';
import { ScanButton } from '../../components/navigation/scanButton';
import ModalFilter from '../../components/elements/modals/ModalFilter';
import colors from '../../assets/colors/colors';
import useKeyboardOffset from '../../hooks/keyboard/useKeyboardOffset';

import TAB_SCREENS from './tabScreensConfig';

const Tab = createBottomTabNavigator();

function getScreenOptions(route: RouteProp<ParamListBase, string>, keyboardOffset: number): BottomTabNavigationOptions {
  const currentTab = TAB_SCREENS.find(tab => tab.name === route.name);
  const hideTabBar = currentTab?.hideTabBar || false;

  const tabBarStyleArray: ViewStyle[] = [
    styles.tabBarStyle,
    {
      bottom: keyboardOffset ? -keyboardOffset : 25,
      ...(hideTabBar && { display: 'none' as const }),
    }
  ];
  
  return {
    tabBarStyle: tabBarStyleArray,
    tabBarItemStyle: styles.tabBarItemStyle,
    tabBarActiveTintColor: colors.green,
    tabBarInactiveTintColor: colors.greyCream,
    tabBarShowLabel: false,
    headerShown: false,
  };
}

function TabNavigator(): ReactElement {
  const { keyboardOffset } = useKeyboardOffset();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const closeFilterModal = () => setFilterModalVisible(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.darkGrey, paddingBottom: insets.bottom }}>
      <Tab.Navigator
        screenOptions={({ route }) => getScreenOptions(route, keyboardOffset)}
      >
        {TAB_SCREENS.map(({ name, component, icon, label, isMiddle, height, width }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon icon={icon} label={label} focused={focused} height={height} width={width} />
              ),
              tabBarButton: isMiddle
                ? (props) => {
                  // Utiliser un composant personnalisé pour éviter le problème de clé
                  return (
                    <ScanButton onPress={props.onPress || (() => {})}>
                      <TabBarIcon 
                        icon={icon} 
                        label="" 
                        focused={false} 
                        height={24} 
                        width={24} 
                      />
                    </ScanButton>
                  );
                }
                : undefined,
            }}
          />
        ))}
      </Tab.Navigator>

      <ModalFilter isVisible={isFilterModalVisible} closeModal={closeFilterModal} />
    </View>
  );
}

const styles = StyleSheet.create<{tabBarStyle: ViewStyle, tabBarItemStyle: ViewStyle}>({
  tabBarItemStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarStyle: {
    backgroundColor: colors.darkGrey,
    borderRadius: 20,
    bottom: 30,
    elevation: 5,
    height: 70,
    left: 20,
    paddingBottom: 0,
    position: 'absolute',
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default TabNavigator;
