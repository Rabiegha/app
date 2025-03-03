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
import FutureEventsScreen from '../screens/FutureEvents';
import PastEventsScreen from '../screens/PastEvents';
import EventDetailsScreen from '../screens/EventDetails';
import EventDetailsPerTypeScreen from '../screens/EventDetailsPerType';
import MenuScreen from '../screens/Menu';

import TabNavigator from './TabNavigator';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../redux/selectors/auth/authSelectors';
import ScanSettingsScreen from '../screens/ScanSettings';

const Stack = createStackNavigator();
const storage = new MMKV();

function AppNavigator() {
  const {isDemoMode} = useContext(AuthContext);
  const userId = useSelector(selectCurrentUserId);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {userId || isDemoMode ? (
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
      <Stack.Screen name="Avenir" component={FutureEventsScreen} />
      <Stack.Screen name="Passees" component={PastEventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="ScanSettings" component={ScanSettingsScreen} />
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
