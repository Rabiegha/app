import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CardStyleInterpolators} from '@react-navigation/stack';
import {MMKV} from 'react-native-mmkv';

import {AuthContext} from '../context/AuthContext';
import ConnexionScreen from '../screens/Connexion';
import EventsScreen from '../screens/Events';
import MoreScreen from '../screens/More';
import EditScreen from '../screens/Edit';
import BadgeScreen from '../screens/Badge';
import AboutScreen from '../screens/About';
import PrintresListScreen from '../screens/PrintersList';
import PaperFormat from '../screens/PaperFormat';
import WebViewScreen from '../screens/WebView';
import HelpScreen from '../screens/Help';
import EventAvenirScreen from '../screens/EventsAvenir';
import EventPasseesScreen from '../screens/EventsPassees';
import EventDetailsScreen from '../screens/EventDetails';
import EventDetailsPerTypeScreen from '../screens/EventDetailsPerType';
import MenuScreen from '../screens/Menu';

import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();
const storage = new MMKV();

function AppNavigator() {
  const {isDemoMode} = useContext(AuthContext);
  const userStatus = storage.getString('user_id');

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userStatus || isDemoMode ? (
        <Stack.Screen name="Events" component={EventsScreen} />
      ) : (
        <Stack.Screen name="Connexion" component={ConnexionScreen} />
      )}
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="More" component={MoreScreen} />
      <Stack.Screen name="Edit" component={EditScreen} />
      <Stack.Screen name="Badge" component={BadgeScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Printers" component={PrintresListScreen} />
      <Stack.Screen name="PaperFormat" component={PaperFormat} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Avenir" component={EventAvenirScreen} />
      <Stack.Screen name="Passees" component={EventPasseesScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen
        name="EventDetailsPerType"
        component={EventDetailsPerTypeScreen}
      />
      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
