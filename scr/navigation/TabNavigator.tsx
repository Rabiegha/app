import React, {useState} from 'react';
import {View, Platform} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ModalFilter from '../components/elements/modals/ModalFilter';

import {TabBarIcon} from '../components/navigation/TabComponent';
import {ScanButton} from '../components/navigation/scanButton';
import colors from '../assets/colors/colors';
import styles from '../assets/styles/styles'; // Consolidated styles
import useKeyboardOffset from '../hooks/keyboard/useKeyboardOffset';
import TAB_SCREENS from './tabScreensConfig';

const Tab = createBottomTabNavigator();

function getScreenOptions(route, keyboardOffset) {
  const currentTab = TAB_SCREENS.find(tab => tab.name === route.name);
  const hideTabBar = currentTab?.hideTabBar || false;

  return {
    tabBarStyle: {
      position: 'absolute',
      bottom: keyboardOffset ? -keyboardOffset : 25,
      left: 20,
      right: 20,
      borderRadius: 15,
      height: 70,
      backgroundColor: colors.darkGrey,
      ...styles.shadow,
      ...(hideTabBar ? {display: 'none'} : {}),
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? 20 : 0, //to remove
    },
    tabBarItemStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabBarIconStyle: {
      alignSelf: 'center',
    },
    tabBarActiveTintColor: colors.green,
    tabBarInactiveTintColor: colors.greyCream,
    tabBarShowLabel: false,
    headerShown: false,
    keyboardHidesTabBar: true,
  };
}

function TabNavigator() {
  const {keyboardOffset} = useKeyboardOffset();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const openFilterModal = () => setFilterModalVisible(true);
  const closeFilterModal = () => setFilterModalVisible(false);

  return (
    <View style={{flex: 1, backgroundColor: colors.darkGrey}}>
      <Tab.Navigator
        lazy={false}
        detachInactiveScreens={true}
        screenOptions={({route}) => getScreenOptions(route, keyboardOffset)}>
        {TAB_SCREENS.map(
          ({name, component, icon, label, isMiddle, height, width}) => (
            <Tab.Screen
              key={name}
              name={name}
              component={component}
              options={{
                tabBarIcon: ({focused}) => (
                  <TabBarIcon
                    icon={icon}
                    label={label}
                    focused={focused}
                    height={height}
                    width={width}
                  />
                ),
                tabBarButton: isMiddle
                  ? props => <ScanButton key={props.key} {...props}/>
                  : undefined,
              }}
            />
          ),
        )}
      </Tab.Navigator>
      <ModalFilter
        isVisible={isFilterModalVisible}
        closeModal={closeFilterModal}
      />
    </View>
  );
}

export default TabNavigator;
