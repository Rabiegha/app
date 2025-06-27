import React, {useState} from 'react';
import {StatusBar, View} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

import AddAttendeesComponent from '../../components/screens/AddAttendeesComponent';
import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import colors from '../../assets/colors/colors';
import {addAttendee} from '../../services/addAttendeeService';
import useAttendeeTypeDropdown from '../../hooks/type/useAttendeeTypesDropdown';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import MainHeader from '../../components/elements/header/MainHeader';

interface AttendeeData {
  current_user_login_details_id: string;
  ems_secret_code: string;
  send_confirmation_mail_ems_yn: number;
  generate_qrcode: number;
  generate_badge: number;
  send_badge_yn: number;
  salutation: string;
  send_badge_item: string;
  attendee_type_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  status_id: string;
  attendee_status: string;
}

const AddAttendeesScreen = () => {

  //navigation
  const navigation = useNavigation();

  //focus effect
  useFocusEffect(
    React.useCallback(() => {
      //set status bar
      StatusBar.setBarStyle('dark-content');
      return () => {};
    }, []),
  );

  //user id
  const userId = useSelector(selectCurrentUserId);

  // Form variables
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [societe, setSociete] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [CheckedIn, setCheckedIn] = useState('1');
  const [isChecked, setIsChecked] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [selectedAttendeeType, setSelectedAttendeeType] = useState('');
  const [loading, setLoading] = useState(false);

  // Context + custom hooks
  const {secretCode, triggerListRefresh} = useEvent();
  const dropdownOptions = useAttendeeTypeDropdown();



  // Reset form fields
  const resetFields = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setNumeroTelephone('');
    setSociete('');
    setJobTitle('');
    setSelectedAttendeeType('');
    setInputErrors({});
  };

  const resetInputError = (field: string) => {
    setInputErrors(prevErrors => ({...prevErrors, [field]: false}));
  };

  // Validate + call service
  const handleEnregistrer = async () => {
    // Start loading
    setLoading(true);

    const errors: Record<string, boolean> = {};
    // Validate each field and set errors
    if (!nom) {
      errors.nom = true;
    }
    if (!prenom) {
      errors.prenom = true;
    }
    if (!email) {
      errors.email = true;
    }

    // Validate email format
    if (email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = true;
      }
    }

    // If there are errors, update the state and stop loading
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      setLoading(false); // <- Stop spinner if validation fails
      return;
    }

    // Build payload for the service
    // Ensure userId is not null before proceeding
    if (!userId) {
      setInputErrors({...inputErrors, userId: 'User ID is required'});
      setLoading(false);
      return;
    }
    
    const attendeeData: AttendeeData = {
      current_user_login_details_id: userId,
      ems_secret_code: secretCode,
      send_confirmation_mail_ems_yn: 0,
      generate_qrcode: 0,
      generate_badge: 1,
      send_badge_yn: 0,
      salutation: '',
      send_badge_item: '',
      attendee_type_id: selectedAttendeeType,
      first_name: prenom,
      last_name: nom,
      email: email,
      phone: numeroTelephone,
      organization: societe,
      jobTitle: jobTitle,
      status_id: '2',
      attendee_status: CheckedIn,
    };

    const success = await addAttendee(attendeeData);

    if (success) {
      resetFields();
      triggerListRefresh();
      Toast.show({
        type: 'customSuccess',
        text1: 'Participant ajouté',
        text2: `${prenom} ${nom}`,
      });
    }
  
    setLoading(false);
  };

  // Toggle checked-in status
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    const newCheckedIn = CheckedIn === '1' ? '0' : '1';
    setCheckedIn(newCheckedIn);
  };

  // Navigate back
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        color={colors.darkGrey}
        onLeftPress={handleGoBack}
        title="Ajouter"
      />

      <Spinner visible={loading} />

      <AddAttendeesComponent
        handleEnregistrer={handleEnregistrer}
        handleCheckboxPress={handleCheckboxPress}
        setNom={setNom}
        setPrenom={setPrenom}
        setEmail={setEmail}
        setNumeroTelephone={setNumeroTelephone}
        setSociete={setSociete}
        setJobTitle={setJobTitle}
        nom={nom}
        prenom={prenom}
        email={email}
        numeroTelephone={numeroTelephone}
        societe={societe}
        jobTitle={jobTitle}
        isChecked={isChecked}
        inputErrors={inputErrors}
        resetInputError={resetInputError}
        attendeeTypes={dropdownOptions}
        selectedAttendeeType={selectedAttendeeType}
        setSelectedAttendeeType={setSelectedAttendeeType} 
        />
    </View>
  );
};


export default AddAttendeesScreen;
