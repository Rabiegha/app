import AddAttendeesScreen from '../screens/AddAttendees';
import QRCodeScannerScreen from '../screens/Scan';
import PrintScreen from '../screens/Print';
import MenuNavigator from './MenuNavigator';
import EventDashboardStackNavigator from './eventDashBoard/EventDashBoardStackNavigator';

export default [
  {
    name: 'Attendees',
    component: EventDashboardStackNavigator,
    icon: require('../assets/images/icons/Participant.png'),
    label: 'Participants',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 30,
  },
  {
    name: 'Add',
    component: AddAttendeesScreen,
    icon: require('../assets/images/icons/Ajouts.png'),
    label: 'Ajouts',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 30,
  },
  {
    name: 'Scan',
    component: QRCodeScannerScreen,
    icon: require('../assets/images/icons/Scan.png'),
    label: '',
    isMiddle: true,
    hideTabBar: true,
    height: 50,
    width: 50,
  },
  {
    name: 'Print',
    component: PrintScreen,
    icon: require('../assets/images/icons/Print.png'),
    label: 'Imprimer',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 20,
  },
  {
    name: 'Menu',
    component: MenuNavigator,
    icon: require('../assets/images/icons/Outils.png'),
    label: 'Menu',
    isMiddle: false,
    hideTabBar: true,
    height: 30,
    width: 30,
  },
];
