import React, {useContext, useState} from 'react';
import {Alert, StatusBar, StyleSheet, View} from 'react-native';
import AddAttendeesComponent from '../components/screens/AddAttendeesComponent';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import {useEvent} from '../context/EventContext';
import axios from 'axios';
import {BASE_URL} from '../config/config';
import {useRoute} from '@react-navigation/native';
import colors from '../../colors/colors';
import FailComponent from '../components/elements/notifications/FailComponent';
import SuccessComponent from '../components/elements/notifications/SuccessComponent';

const AddAttendeesScreen = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {};
    }, []),
  );

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [societe, setSociete] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [success, setSuccess] = useState(null);
  const [CheckedIn, setCheckedIn] = useState('1');
  const route = useRoute();
  const [isChecked, setIsChecked] = useState(false);
  const [inputErrors, setInputErrors] = useState({});

  const resetFields = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setNumeroTelephone('');
    setSociete('');
    setJobTitle('');
    setInputErrors({});
  };

  const {secretCode} = useEvent();
  const {triggerListRefresh} = useEvent();

  const resetInputError = field => {
    setInputErrors(prevErrors => ({...prevErrors, [field]: false}));
  };

  const handleEnregistrer = async () => {
    const errors = {};

    // Validate each field and set errors
    if (!nom) {
      errors.nom = true;
    }
    if (!prenom) {
      errors.prenom = true;
    }
    // Validate phone number (starts with 0 and has at least 10 digits)
    if (!numeroTelephone == '') {
      const phoneRegex = /^0\d{9,}$/;
      if (!phoneRegex.test(numeroTelephone)) {
        errors.numeroTelephone = true;
      }
    }

    // Validate email format
    if (!email == '') {
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
    };

    try {
      const url = `${BASE_URL}/add_attendee/?ems_secret_code=${attendeeData.ems_secret_code}&salutation=${attendeeData.salutation}&first_name=${attendeeData.first_name}&last_name=${attendeeData.last_name}&email=${attendeeData.email}&phone=${attendeeData.phone}&organization=${attendeeData.organization}&designation=${attendeeData.jobTitle}&attendee_status=${attendeeData.attendee_status}`;

      const response = await axios.post(url);

      if (response.data.status) {
        setSuccess(true);
        resetFields();
        triggerListRefresh();
      } else {
        setSuccess(false);
      }
    } catch (error) {
      setSuccess(false);
    }
  };

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    const newCheckedIn = CheckedIn == 1 ? 0 : 1;
    setCheckedIn(newCheckedIn);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setSuccess(null);
    }, []),
  );

  const handleGoBack = () => {
    navigation.navigate('Attendees');
  };

  return (
    <View style={[globalStyle.backgroundWhite, styles.wrap]}>
      <HeaderComponent
        title="Modifier"
        color={undefined}
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
