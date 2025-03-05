import React from 'react';
import {ScrollView, StyleSheet, View, Image, Text} from 'react-native';
import LabelValueComponent from '../elements/LabelValueComponent';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../assets/colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import userIcon from '../../assets/images/user.png';
import ScanIcon from '../../assets/images/icons/Scan.png';
import EditIcon from '../../assets/images/icons/Modifier.png';
import PrintIcon from '../../assets/images/icons/Print.png';
import HoldButton from '../elements/buttons/HoldButton';
import { insertSpaceBetweenPairs } from '../../hooks/useFormat';


const MoreComponent = ({
  firstName,
  lastName,
  email,
  phone,
  attendeeStatus,
  organization,
  JobTitle,
  See,
  Print,
  handleButton,
  loading,
  modify,
  type,
}) => {

  const formattedPhone = insertSpaceBetweenPairs(phone);
  const parsedAttendeeStatus = Number(attendeeStatus);

  return (
    <View
      style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={userIcon} style={styles.image} />
      </View>
      <View style={styles.topButtonsContainer}>
        <SmallButton
          imageSource={ScanIcon}
          pressHandler={See}
          backgroundColor={colors.green}
          tintColor={colors.greyCream}
        />
        <SmallButton
          imageSource={EditIcon}
          pressHandler={modify}
          backgroundColor={colors.greyCream}
          tintColor={colors.darkGrey}
        />
        <SmallButton
          imageSource={PrintIcon}
          pressHandler={Print}
          backgroundColor={colors.greyCream}
          tintColor={colors.darkGrey}
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
        <LabelValueComponent label="Type:" value={type ? type : '-'} value2={undefined} />
        <LabelValueComponent
          label="Nom:"
          value={firstName && lastName ? `${firstName} ${lastName}` : '- '}
          modifyDisplay="none"
        />
        <LabelValueComponent
          label="Adresse mail:"
          value={email ? email : '-'}
          modifyDisplay="none"
        />
        <LabelValueComponent
          label="Téléphone:"
          value={formattedPhone ? formattedPhone : '-'} value2={undefined}        />
        <LabelValueComponent
          label="Entreprise:"
          value={organization ? organization : '-'} value2={undefined}        />
        <LabelValueComponent
          label="Job Title:"
          value={JobTitle ? JobTitle : '-'} value2={undefined}        />
      </ScrollView>
      {/*<Text>Status: {attendeeStatus}</Text> */}
      <View style={styles.buttonContainer}>
        {parsedAttendeeStatus == 0 ? (
          <LargeButton
            title="Check-in"
            onPress={() => handleButton(1)}
            backgroundColor={colors.green}
            loading={loading} // Pass loading prop
          />
        ) : (
          <HoldButton
            title="Undo Check-in"
            onPress={() => handleButton(0)}
            backgroundColor={colors.red}
            holdDuration={1000} // Duration to hold the button for 3 seconds
            loading={loading} // Pass loading prop
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    position: 'relative',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 40,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});

export default MoreComponent;
