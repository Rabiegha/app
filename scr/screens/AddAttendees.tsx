import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import AddAttendeesComponent from '../components/screens/AddAttendeesComponent';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import {useEvent} from '../context/EventContext';
import colors from '../assets/colors/colors';
import FailComponent from '../components/elements/notifications/FailComponent';
import SuccessComponent from '../components/elements/notifications/SuccessComponent';
import {addAttendee} from '../services/addAttendeeService';
import useAttendeeTypeDropdown from '../hooks/type/useAttendeeTypesDropdown';

const AddAttendeesScreen = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {};
    }, []),
  );

  //form variables
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [societe, setSociete] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [success, setSuccess] = useState(null);
  const [CheckedIn, setCheckedIn] = useState('1');
  const [isChecked, setIsChecked] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const [selectedAttendeeType, setSelectedAttendeeType] = useState('');

  //function to reset fields
  const resetFields = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setNumeroTelephone('');
    setSociete('');
    setJobTitle('');
    setInputErrors({});
  };

  //the secret code
  const {secretCode} = useEvent();
  const {triggerListRefresh} = useEvent();

  const resetInputError = field => {
    setInputErrors(prevErrors => ({...prevErrors, [field]: false}));
  };

  //handle enregister

  //N.B deplace the end pont call to the service file.

  const handleEnregistrer = async () => {
    const errors = {};

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
    // Validate phone number (starts with 0 and has at least 10 digits)
/*     if (!numeroTelephone == '') {
      const phoneRegex = /^0\d{9,}$/;
      if (!phoneRegex.test(numeroTelephone)) {
        errors.numeroTelephone = true;
      }
    } */

    // Validate email format
    if (email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = true;
      }
    }

    // If there are errors, update the state and return
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    const attendeeData = {
      send_confirmation_mail_ems_yn: 0,
      generate_qrcode: 0,
      generate_badge: 0,
      send_badge_yn: 0,
      ems_secret_code: secretCode,
      salutation: '',
      first_name: prenom,
      last_name: nom,
      email: email,
      phone: numeroTelephone,
      organization: societe,
      jobTitle: jobTitle,
      status_id: '2',
      attendee_status: CheckedIn,
      attendee_type_id: selectedAttendeeType,
    };

    try {
      const response = await addAttendee(attendeeData);

      if (response) {
        setSuccess(true);
        resetFields();
        triggerListRefresh();
        setSelectedAttendeeType(null);
      }
    } catch (error) {
      setSuccess(false);
    }
  };

  //checked-in or not handler
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    const newCheckedIn = CheckedIn == 1 ? 0 : 1;
    setCheckedIn(newCheckedIn);
  };

  //set success to null
  useFocusEffect(
    React.useCallback(() => {
      return () => setSuccess(null);
    }, []),
  );

  //navigate back
  const handleGoBack = () => {
    navigation.navigate('Attendees');
  };

  const dropdownOptions = useAttendeeTypeDropdown();

  return (
    <View style={[globalStyle.backgroundWhite, styles.wrap]}>
      <HeaderComponent
        title="Ajouter"
        color={colors.darkGrey}
        handlePress={handleGoBack}
        backgroundColor={'white'}
      />
      {success === true && (
        <SuccessComponent
          onClose={() => setSuccess(null)}
          text={'Participant ajouté avec succès'}
        />
      )}
      {success === false && (
        <FailComponent
          onClose={() => setSuccess(null)}
          text={'Participant non ajouté'}
        />
      )}
      <AddAttendeesComponent
        onPress={handleEnregistrer}
        style={[globalStyle.container, {marginTop: 50}]}
        handleCheckboxPress={handleCheckboxPress}
        setNom={setNom}
        setPrenom={setPrenom}
        setEmail={setEmail}
        setNumeroTelephone={setNumeroTelephone}
        setSociete={setSociete}
        setJobTitle={setJobTitle}
        setSuccess={setSuccess}
        nom={nom}
        prenom={prenom}
        email={email}
        numeroTelephone={numeroTelephone}
        societe={societe}
        jobTitle={jobTitle}
        isChecked={isChecked}
        success={success}
        inputErrors={inputErrors}
        resetInputError={resetInputError}
        attendeeTypes={dropdownOptions}
        selectedAttendeeType={selectedAttendeeType}
        setSelectedAttendeeType={setSelectedAttendeeType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    top: 35,
  },
});

export default AddAttendeesScreen;
