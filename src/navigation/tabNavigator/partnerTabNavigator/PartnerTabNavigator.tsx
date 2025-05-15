import React, { useState } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '../../../components/navigation/TabBarIconComponent';
import { ScanButton } from '../../../components/navigation/scanButton';
import ModalFilter from '../../../components/elements/modals/ModalFilter';
import TAB_SCREENS from './PartnerTabScreensConfig.tsx';
import colors from '../../../assets/colors/colors';
import useKeyboardOffset from '../../../hooks/keyboard/useKeyboardOffset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function getScreenOptions(route, keyboardOffset) {
  const currentTab = TAB_SCREENS.find(tab => tab.name === route.name);
  const hideTabBar = currentTab?.hideTabBar || false;

  return {
    tabBarStyle: [
      styles.tabBarStyle,
      {
        bottom: keyboardOffset ? -keyboardOffset : 25,
        ...(hideTabBar && { display: 'none' }),
      }
    ],
    tabBarItemStyle: styles.tabBarItemStyle,
    tabBarActiveTintColor: colors.green,
    tabBarInactiveTintColor: colors.greyCream,
    tabBarShowLabel: false,
    headerShown: false,
  };
}

function PartnerTabNavigator() {
  const { keyboardOffset } = useKeyboardOffset();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const insets = useSafeAreaInsets();

  const openFilterModal = () => setFilterModalVisible(true);
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
                ? props => <ScanButton key={props.key} {...props} />
                : undefined,
            }}
          />
        ))}
      </Tab.Navigator>

      <ModalFilter isVisible={isFilterModalVisible} closeModal={closeFilterModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: colors.darkGrey,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    paddingBottom: 0,
  },
  tabBarItemStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PartnerTabNavigator;
