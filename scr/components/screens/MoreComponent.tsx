import React from 'react';
import {ScrollView, StyleSheet, View, Image, Text} from 'react-native';
import LabelValueComponent from '../elements/LabelValueComponent';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../assets/colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import userIcon from '../../assets/images/user.png';
import ScanIcon from '../../assets/images/icons/Scan.png';
import EditIcon from '../../assets/images/icons/Modifier.png';
import HoldButton from '../elements/buttons/HoldButton';

const MoreComponent = ({
  firstName,
  lastName,
  email,
  phone,
  attendeeStatus,
  organization,
  JobTitle,
  See,
  handleButton,
  loading,
  modify,
  type,
}) => {
  console.log('Current attendeeStatus:', attendeeStatus);
  console.log('Current attendeeStatus:', JobTitle);

  function insertSpaceBetweenPairs(str) {
    if (str == null) {
      return '';
    }

    let removePlus = false;

    if (str.startsWith('+0')) {
      str = str.slice(1);
      removePlus = true;
    }

    if (removePlus) {
      return str.match(/.{1,2}/g)?.join(' ') || '';
    } else {
      var firstThreeChars = str.slice(0, 3);
      var fourthChar = str.slice(3, 4);
      var restOfChars = str.slice(4);

      var stringWithSpaces = restOfChars.match(/.{1,2}/g)?.join(' ') || '';

      return firstThreeChars + ' ' + fourthChar + ' ' + stringWithSpaces;
    }
  }

  const parsedAttendeeStatus = Number(attendeeStatus);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
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
      </View>
      <LabelValueComponent label="Type:" value={type ? type : '-'} />
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
        value={phone ? insertSpaceBetweenPairs(phone) : '-'}
      />
      <LabelValueComponent
        label="Entreprise:"
        value={organization ? organization : '-'}
      />
      <LabelValueComponent
        label="Job Title:"
        value={JobTitle ? JobTitle : '-'}
      />
      {/*<Text>Status: {attendeeStatus}</Text> */}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '110%',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 40,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default MoreComponent;
