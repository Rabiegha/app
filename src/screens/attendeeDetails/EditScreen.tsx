import React, {useContext, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle.tsx';
import {useEvent} from '../../context/EventContext.tsx';
import EditComponent from '../../components/screens/EditComponent.tsx';
import colors from '../../assets/colors/colors.tsx';
import SuccessComponent from '../../components/elements/notifications/SuccessComponent.tsx';
import FailComponent from '../../components/elements/notifications/FailComponent.tsx';
import {editAttendee} from '../../services/editAttendeeService.tsx';
import useAttendeeTypeDropdown from '../../hooks/type/useAttendeeTypesDropdown.tsx';
import {useSelector} from 'react-redux';
import {selectCurrentUserId} from '../../redux/selectors/auth/authSelectors.tsx';
import Spinner from 'react-native-loading-spinner-overlay';
import MainHeader from '../../components/elements/header/MainHeader.tsx';

const EditScreen = ({navigation, route}) => {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      return () => {};
    }, []),
  );
  userId;
  const [success, setSuccess] = useState(null);
  const {secretCode, eventId, updateAttendee, triggerListRefresh} = useEvent();
  const [attendeeTypes, setAttendeeTypes] = useState([]);
  const userId = useSelector(selectCurrentUserId);
  const {
    attendeeId,
    firstName,
    lastName,
    email,
    phone,
    organization,
    jobTitle,
    type,
    typeId,
  } = route.params;

  const [nomModify, setNomModify] = useState(lastName);
  const [prenomModify, setPrenomModify] = useState(firstName);
  const [emailModify, setEmailModify] = useState(email);
  const [numeroTelephoneModify, setNumeroTelephoneModify] = useState(phone);
  const [societeModify, setSocieteModify] = useState(organization);
  const [jobTitleModify, setJobTitleModify] = useState(jobTitle);
  const [typeModify, setTypeModify] = useState(type);
  const [typeIdModify, setTypeIdModify] = useState(typeId);
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
    if (!emailModify) {
      errors.email = true;
    }

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
      setLoading(false);
      setSuccess(false);
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
      userId: userId,
      salutation: '',
      attendeeId: attendeeId,
      first_name: prenomModify,
      last_name: nomModify,
      email: emailModify,
      phone: numeroTelephoneModify,
      organization: societeModify,
      jobTitle: jobTitleModify,
      typeId: typeIdModify,
      status_id: '2',
    };

    try {
      const response = await editAttendee(attendeeData);

      if (response) {
        console.log('Enregistrement réussi:');
        setSuccess(true);
        triggerListRefresh();
        resetFields();
        updateAttendee(eventId, {
          id: attendeeId,
          attendee_status: '2', // or the updated status
          first_name: prenomModify,
          last_name: nomModify,
          email: emailModify,
          phone: numeroTelephoneModify,
          jobTitle: jobTitleModify,
          type: typeModify,
          typeId: typeIdModify,
          event_id: eventId,
        });
      } else {
        console.error('Enregistrement échoué:');
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

  const handleGoBack = () => {
    navigation.navigate('More', {
      eventId: eventId,
      attendeeId: attendeeId,
      firstName: prenomModify,
      lastName: nomModify,
      email: emailModify,
      phone: numeroTelephoneModify,
      organization: societeModify,
      jobTitle: jobTitleModify,
      type: typeModify,
      typeId: typeIdModify,
    });
  };

  const resetInputError = field => {
    setInputErrors(prevErrors => {
      const newErrors = {...prevErrors};
      delete newErrors[field];
      return newErrors;
    });
  };
  // Use the custom hook
  const dropdownOptions = useAttendeeTypeDropdown();

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        color={colors.darkGrey}
        onLeftPress={handleGoBack}
        title="Modifier"
      />
      {success === true && (
        <SuccessComponent
          onClose={() => setSuccess(null)}
          text={'Modification enregisreè'}
        />
      )}
      {success === false && (
        <FailComponent
          onClose={() => setSuccess(null)}
          text={'Modification non enregistrée'}
        />
      )}
      <Spinner visible={loading} />
      <EditComponent
        onPress={handleEnregistrer}
        style={[globalStyle.container, {marginTop: 50}]}
        nom={nomModify}
        prenom={prenomModify}
        email={emailModify}
        societe={societeModify}
        jobTitle={jobTitleModify}
        numeroTelephone={numeroTelephoneModify}
        type={typeModify}
        typeId={typeId}
        success={success}
        inputErrors={inputErrors}
        attendeeTypes={dropdownOptions}
        setNom={setNomModify}
        setPrenom={setPrenomModify}
        setEmail={setEmailModify}
        setNumeroTelephone={setNumeroTelephoneModify}
        setSociete={setSocieteModify}
        setJobTitle={setJobTitleModify}
        setSuccess={setSuccess}
        setType={setTypeModify}
        setTypeId={setTypeIdModify}
        resetInputError={resetInputError}
      />
    </View>
  );
};

export default EditScreen;
