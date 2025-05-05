import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import AddAttendeesComponent from '../../components/screens/AddAttendeesComponent';
import {useFocusEffect} from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import {useEvent} from '../../context/EventContext';
import colors from '../../assets/colors/colors';
import FailComponent from '../../components/elements/notifications/FailComponent';
import SuccessComponent from '../../components/elements/notifications/SuccessComponent';
import {addAttendee} from '../../services/addAttendeeService';
import useAttendeeTypeDropdown from '../../hooks/type/useAttendeeTypesDropdown';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import MainHeader from '../../components/elements/header/MainHeader';

const AddAttendeesScreen = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
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
  const [success, setSuccess] = useState(null);
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

  const resetInputError = field => {
    setInputErrors(prevErrors => ({...prevErrors, [field]: false}));
  };

  // Validate + call service
  const handleEnregistrer = async () => {
    // Start loading
    setLoading(true);

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
    const attendeeData = {
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

    try {
      const response = await addAttendee(attendeeData);
      if (response) {
        setSuccess(true);
        resetFields();
        triggerListRefresh();
      } else {
        setSuccess(false);
      }
    } catch (error) {
      setSuccess(false);
    } finally {
      // Always stop loading
      setLoading(false);
    }
  };

  // Toggle checked-in status
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    const newCheckedIn = CheckedIn === '1' ? '0' : '1';
    setCheckedIn(newCheckedIn);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => setSuccess(null);
    }, []),
  );

  // Navigate back
  const handleGoBack = () => {
    navigation.navigate('Attendees');
  };

  return (
    <View style={[globalStyle.backgroundWhite, styles.wrap]}>
      <MainHeader
        color={colors.darkGrey}
        onLeftPress={handleGoBack}
        title="Ajouter"
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

      <Spinner visible={loading} />

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
});

export default AddAttendeesScreen;
