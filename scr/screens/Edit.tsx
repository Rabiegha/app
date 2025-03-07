import React, { useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../redux/selectors/auth/authSelectors.tsx';
import { useEvent } from '../context/EventContext';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import Spinner from 'react-native-loading-spinner-overlay';

import HeaderComponent from '../components/elements/header/HeaderComponent';
import EditComponent from '../components/screens/EditComponent';
import SuccessComponent from '../components/elements/notifications/SuccessComponent';
import FailComponent from '../components/elements/notifications/FailComponent';

import useEditAttendee from '../hooks/useEditAttendee';  // Custom hook for state & logic
import useAttendeeTypeDropdown from '../hooks/type/useAttendeeTypesDropdown.tsx';

const EditScreen = ({ navigation, route }) => {
  useFocusEffect(() => {
    StatusBar.setBarStyle('dark-content');
    return () => {};
  });

  const userId = useSelector(selectCurrentUserId);
  const { eventId, updateAttendee, triggerListRefresh } = useEvent();
  const dropdownOptions = useAttendeeTypeDropdown();

  const {
    attendeeData,
    setAttendeeData,
    success,
    setSuccess,
    inputErrors,
    loading,
    handleEnregistrer,
    resetInputError,
  } = useEditAttendee(route.params, userId, eventId, updateAttendee, triggerListRefresh);

  const handleGoBack = () => {
    navigation.navigate('More', { ...attendeeData });
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Modifier"
        color={colors.darkGrey}
        handlePress={handleGoBack}
        backgroundColor="white"
      />

      {success === true && <SuccessComponent onClose={() => setSuccess(null)} text="Modification enregistrée" />}
      {success === false && <FailComponent onClose={() => setSuccess(null)} text="Modification non enregistrée" />}
      <Spinner visible={loading} />

      <EditComponent
        onPress={handleEnregistrer}
        style={[globalStyle.container, { marginTop: 50 }]}
        {...attendeeData}
        success={success}
        inputErrors={inputErrors}
        attendeeTypes={dropdownOptions}
        setAttendeeData={setAttendeeData}
        resetInputError={resetInputError}
      />
    </View>
  );
};

export default EditScreen;
