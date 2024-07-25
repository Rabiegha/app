import React, {useContext, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import MoreScreen from '../screens/More';
import AddAttendeesScreen from '../screens/AddAttendees';
import MenuScreen from '../screens/Menu';
import QRCodeScannerScreen from '../screens/Scann';
import ModalFilter from '../components/modals/ModalFilter';
import colors from '../../colors/colors';
import AttendeesScreen from '../screens/Attendees';
import BadgeScreen from '../screens/Badge';
import AboutScreen from '../screens/About';
import HelpScreen from '../screens/Help';
import ConnexionScreen from '../screens/Connexion';
import {NavigationContainer} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import EventsScreen from '../screens/Events';
import EventAvenirScreen from '../screens/EventsAvenir';
import EventPasseesScreen from '../screens/EventsPassees';
import {EventProvider, useEvent} from '../context/EventContext';
import {MMKV} from 'react-native-mmkv';
import ProfilScreen from '../screens/Profil';
import {AuthContext} from '../context/AuthContext';
import Participant from '../assets/images/icons/Participant.png';
import Ajouts from '../assets/images/icons/Ajouts.png';
import Scan from '../assets/images/icons/Scan.png';
import Profil from '../assets/images/icons/Profil.png';
import Outils from '../assets/images/icons/Outils.png';
import WebViewScreen from '../screens/WebView';
import EditScreen from '../screens/Edit';

const storage = new MMKV();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CustomTabButton({children, onPress}) {
  return (
    <TouchableOpacity style={{flex: 1}} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}
function ScanButton({children, onPress}) {
  return (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}>
      <View
        style={{
          width: 90,
          height: 60,
          borderRadius: 20,
          backgroundColor: colors.green,
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

function TabNavigator() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      // Ajustez selon la hauteur du clavier
      setKeyboardOffset(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const [bottomPadding, setBottomPadding] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        // Adjust the bottom padding based on the keyboard height
        setBottomPadding(e.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setBottomPadding(0); // Reset the padding when keyboard hides
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            bottom: keyboardOffset ? -keyboardOffset : 25,
            left: 20,
            right: 20,
            elevation: 0,
            borderRadius: 15,
            height: 70,
            backgroundColor: colors.darkGrey,
            ...styles.shadow,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          tabBarActiveTintColor: colors.green,
          tabBarInactiveTintColor: colors.greyCream,
          tabBarShowLabel: false,
          headerShown: false,
          keyboardHidesTabBar: true,
          ...(Platform.OS === 'ios' ? {marginTop: 50} : {}),
        }}>
        <Tab.Screen
          name="Attendees"
          component={AttendeesScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.navBarIcons}>
                <Image
                  source={Participant}
                  resizeMode="contain"
                  style={{
                    width: 32,
                    height: 32,
                    tintColor: focused ? colors.green : colors.greyCream,
                  }}
                />
                <Text
                  style={{
                    color: focused ? colors.green : colors.greyCream,
                    fontSize: 8,
                  }}>
                  Participants
                </Text>
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Add"
          component={AddAttendeesScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.navBarIcons}>
                <Image
                  source={Ajouts}
                  resizeMode="contain"
                  style={{
                    width: 32,
                    height: 32,
                    tintColor: focused ? colors.green : colors.greyCream,
                  }}
                />
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    color: focused ? colors.green : colors.greyCream,
                    fontSize: 8,
                  }}>
                  Ajouts
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Scann"
          component={QRCodeScannerScreen}
          options={({route}) => ({
            tabBarIcon: ({focused}) => (
              <Image
                source={Scan}
                resizeMode="contain"
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: 60,
                  height: 60,
                  tintColor: colors.greyCream,
                }}
              />
            ),
            tabBarButton: props => <ScanButton {...props} />,
            tabBarStyle: {display: 'none'},
          })}
        />

        <Tab.Screen
          name="Profil"
          component={ProfilScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.navBarIcons}>
                <Image
                  source={Profil}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: focused ? colors.green : colors.greyCream,
                  }}
                />
                <Text
                  style={{
                    color: focused ? colors.green : colors.greyCream,
                    fontSize: 8,
                  }}>
                  Profil
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View style={styles.navBarIcons}>
                <Image
                  source={Outils}
                  resizeMode="contain"
                  style={{
                    width: 32,
                    height: 32,
                    tintColor: focused ? colors.green : colors.greyCream,
                  }}
                />
                <Text
                  style={{
                    color: focused ? colors.green : colors.greyCream,
                    fontSize: 8,
                  }}>
                  Menu
                </Text>
              </View>
            ),
            tabBarStyle: {display: 'none'},
          }}
        />
      </Tab.Navigator>
      <ModalFilter
        isVisible={isFilterModalVisible}
        closeModal={closeFilterModal}
      />
    </View>
  );
}
function AppNavigator() {
  const {userStatus, isDemoMode} = useContext(AuthContext);
  //console.log('rrrr', userStatus);
  const userStatus1 = storage.getString('user_id');
  //console.log('rrrr', userStatus1);

  return (
    <EventProvider>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {userStatus1 || isDemoMode ? (
          <Stack.Screen name="Events" component={EventsScreen} />
        ) : (
          <Stack.Screen name="Connexion" component={ConnexionScreen} />
        )}

        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerShown: false,
            gestureEnabled: false, // Disable gestures for this screen
          }}
        />
        <Stack.Screen name="More" component={MoreScreen} />
        <Stack.Screen name="Edit" component={EditScreen} />
        <Stack.Screen name="Badge" component={BadgeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Avenir" component={EventAvenirScreen} />
        <Stack.Screen name="Passees" component={EventPasseesScreen} />
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
      </Stack.Navigator>
    </EventProvider>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  navBarIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    ...(Platform.OS === 'ios' ? {marginTop: 20} : {marginTop: 0}),
  },
});

export default AppNavigator;
