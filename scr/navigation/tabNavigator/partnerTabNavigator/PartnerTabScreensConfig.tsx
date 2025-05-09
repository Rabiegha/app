import PartnerAttendeesListScreen from '../../../screens/partner/PartnerListScreen';
import ProfileScreen from '../../../screens/profil/Profil';
import ScanPartnerScreen from '../../../screens/partner/scan/ScanPartnerScreen';

export default [
  {
    name: 'Attendees',
    component: PartnerAttendeesListScreen,
    icon: require('../../../assets/images/icons/Participant.png'),
    label: 'Participants',
    isMiddle: false,
    hideTabBar: false,
    height: 30,
    width: 30,
  },
  {
    name: 'Scan',
    component: ScanPartnerScreen,
    icon: require('../../../assets/images/icons/Scan.png'),
    label: '',
    isMiddle: true,
    hideTabBar: true,
    height: 50,
    width: 50,
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: require('../../../assets/images/icons/Profil.png'),
    label: 'Profile',
    isMiddle: false,
    hideTabBar: true,
    height: 30,
    width: 30,
  },
];
