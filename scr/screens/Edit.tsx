import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import {useEvent} from '../context/EventContext';
import axios from 'axios';
import {BASE_URL} from '../config/config';
import EditComponent from '../components/screens/EditComponent';
import useUserId from '../hooks/useUserId';

const EditScreen = ({navigation, route}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {};
    }, []),
  );
  const [userId, setUserId] = useUserId();
  const [success, setSuccess] = useState(null);
  const {secretCode, eventId, updateAttendee, triggerListRefresh} = useEvent();

  const {
    attendeeId,
    firstName,
    lastName,
    email,
    phone,
    organization,
    jobTitle,
  } = route.params;

  const [nomModify, setNomModify] = useState(lastName);
  const [prenomModify, setPrenomModify] = useState(firstName);
  const [emailModify, setEmailModify] = useState(email);
  const [numeroTelephoneModify, setNumeroTelephoneModify] = useState(phone);
  const [societeModify, setSocieteModify] = useState(organization);
  const [jobTitleModify, setJobTitleModify] = useState(jobTitle);
  const [inputErrors, setInputErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setInputErrors({});
  };

  const handleEnregistrer = async () => {
    const errors = {};
    setLoading(true);

    // Validate each field and set errors
    if (!nomModify) {
      errors.nom = true;
    }
    if (!prenomModify) {
      errors.prenom = true;
    }
    // Validate phone number (starts with 0 and has at least 9 digits)
    /*     if (numeroTelephoneModify) {
      const phoneRegex = /^0\d{8,}$/;
      if (!phoneRegex.test(numeroTelephoneModify)) {
        errors.numeroTelephone = true;
      }
    } */

    // Validate email format
    if (emailModify) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailModify)) {
        errors.email = true;
      }
    }

    // If there are errors, update the state and return
    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    // Logique pour traiter les données du formulaire
    const attendeeData = {
      send_confirmation_mail_ems_yn: 0,
      generate_qrcode: 0,
      generate_badge: 0,
      send_badge_yn: 0,
      // Plus d'options...
      ems_secret_code: secretCode,
      salutation: '',
      first_name: prenomModify,
      last_name: nomModify,
      email: emailModify,
      phone: numeroTelephoneModify,
      organization: societeModify,
      jobTitle: jobTitleModify,
      status_id: '2',
    };

    try {
      // URL de l'API pour ajouter un participants
      const url = `${BASE_URL}/ajax_update_attendee/?current_user_login_details_id=${userId}&attendee_id=${attendeeId}&first_name=${attendeeData.first_name}&last_name=${attendeeData.last_name}&email=${attendeeData.email}&phone=${attendeeData.phone}&organization=${attendeeData.organization}&designation=${attendeeData.jobTitle}`;

      const response = await axios.post(url);

      if (response.data.status) {
        console.log('Enregistrement réussi:', response.data);
        setSuccess(true);
        await updateAttendee(eventId, {...attendeeData, id: attendeeId});
        triggerListRefresh();
        resetFields();
      } else {
        console.error('Enregistrement échoué:', response.data.message);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setSuccess(null);
    }, []),
  );
  useEffect(() => {
    console.log('attendeeId', attendeeId);
  });

  const handleGoBack = updatedAttendee => {
    navigation.navigate('More', {
      eventId: eventId,
      attendeeId: attendeeId,
      firstName: prenomModify,
      lastName: nomModify,
      email: emailModify,
      phone: numeroTelephoneModify,
      organization: societeModify,
      jobTitle: jobTitleModify,
    });
  };

  const resetInputError = field => {
    setInputErrors(prevErrors => {
      const newErrors = {...prevErrors};
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Modifier"
        color={undefined}
        handlePress={handleGoBack}
        backgroundColor={'white'}
      />
      <EditComponent
        onPress={handleEnregistrer}
        style={[globalStyle.container, {marginTop: 50}]}
        nom={nomModify}
        prenom={prenomModify}
        email={emailModify}
        societe={societeModify}
        jobTitle={jobTitleModify}
        success={success}
        numeroTelephone={numeroTelephoneModify}
        setNom={setNomModify}
        setPrenom={setPrenomModify}
        setEmail={setEmailModify}
        setNumeroTelephone={setNumeroTelephoneModify}
        setSociete={setSocieteModify}
        setJobTitle={setJobTitleModify}
        setSuccess={setSuccess}
        inputErrors={inputErrors}
        resetInputError={resetInputError}
      />
    </View>
  );
};

export default EditScreen;
