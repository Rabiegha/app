import React, {useContext} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {AuthContext} from '../context/AuthContext';
import ConnexionScreen from '../screens/Connexion';
import EventsScreen from '../screens/event/Events';
import MoreScreen from '../screens/More';
import EditScreen from '../screens/Edit';
import BadgeScreen from '../screens/Badge';
import PrintresListScreen from '../screens/PrintersList';
import PaperFormat from '../screens/PaperFormat';
import WebViewScreen from '../screens/WebView';
import FutureEventsScreen from '../screens/event/FutureEvents';
import PastEventsScreen from '../screens/event/PastEvents';
import EventDetailsPerTypeScreen from '../screens/EventDetailsPerType';
import TabNavigator from './tabNavigator/TabNavigator';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../redux/selectors/auth/authSelectors';

const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="Printers" component={PrintresListScreen} />
      <Stack.Screen name="PaperFormat" component={PaperFormat} />
      <Stack.Screen name="WebView" component={WebViewScreen} />
      <Stack.Screen name="Avenir" component={FutureEventsScreen} />
      <Stack.Screen name="Passees" component={PastEventsScreen} />
      <Stack.Screen
        name="EventDetailsPerType"
        component={EventDetailsPerTypeScreen}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
