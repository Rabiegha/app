import React from 'react';
import AddAttendeesScreen from '../../screens/add/AddAttendeesScreen';
import PrintScreen from '../../screens/print/PrintScreen';
import MenuNavigator from './MenuNavigator';
import EventDashboardStackNavigator from '../eventDashBoard/EventDashboardStack';
import MainScanScreen from '../../screens/scanScreen/MainScanScreen';
import Icons from '../../assets/images/icons';
import { ComponentType } from 'react';

interface TabScreenConfig {
  name: string;
  component: ComponentType<any>;
  icon: any;
  label: string;
  isMiddle: boolean;
  hideTabBar: boolean;
  height: number;
  width: number;
}

const tabScreensConfig: TabScreenConfig[] = [
  {
    name: 'EventDashboard',
    component: EventDashboardStackNavigator,
    icon: Icons.Participant,
    label: 'Participants',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 30,
  },
  {
    name: 'Add',
    component: AddAttendeesScreen,
    icon: Icons.Ajouts,
    label: 'Ajouts',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 30,
  },
  {
    name: 'Scan',
    component: MainScanScreen,
    icon: Icons.Scan,
    label: '',
    isMiddle: true,
    hideTabBar: true,
    height: 50,
    width: 50,
  },
  {
    name: 'Print',
    component: PrintScreen,
    icon: Icons.Print,
    label: 'Imprimer',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 20,
  },
  {
    name: 'Menu',
    component: MenuNavigator,
    icon: Icons.Outils,
    label: 'Menu',
    isMiddle: false,
    hideTabBar: true,
    height: 30,
    width: 30,
  },
];

export default tabScreensConfig;
