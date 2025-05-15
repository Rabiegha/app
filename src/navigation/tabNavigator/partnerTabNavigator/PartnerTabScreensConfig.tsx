import PartnerAttendeesListScreen from '../../../screens/partner/PartnerListScreen';
import ProfileScreen from '../../../screens/profil/Profil';
import ScanScreen from '../../../screens/scanScreen/ScanScreen';
import { ScanType } from '../../../components/commonScan/types/scan';
import React from 'react';
import Icons from '../../../assets/images/icons';
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

const partnerTabScreensConfig: TabScreenConfig[] = [
  {
    name: 'Attendees',
    component: PartnerAttendeesListScreen,
    icon: Icons.Participant,
    label: 'Participants',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 30,
  },
  {
    name: 'Scan',
    component: () => <ScanScreen scanType={ScanType.Partner} />,
    icon: Icons.Scan,
    label: '',
    isMiddle: true,
    hideTabBar: true,
    height: 50,
    width: 50,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: Icons.Profil,
    label: 'Profile',
    isMiddle: false,
    hideTabBar: true,
    height: 30,
    width: 30,
  },
];

export default partnerTabScreensConfig;
