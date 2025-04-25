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
  attendeeStatusChangeDatetime,
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
    <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={userIcon} style={styles.image} />
      </View>
      <View style={styles.topButtonsContainer}>
        <SmallButton
          imageSource={PrintIcon}
          pressHandler={Print}
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
          imageSource={ScanIcon}
          pressHandler={See}
          backgroundColor={colors.greyCream}
          tintColor={colors.darkGrey}
        />
      </View>
      <View style={styles.container}>
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
        {parsedAttendeeStatus === 1 && (
          <LabelValueComponent
            label="Date de check-in:"
            value={attendeeStatusChangeDatetime || '-'} value2={undefined}          />
        )}
        </View>
      {/*<Text>Status: {attendeeStatus}</Text> */}
        {parsedAttendeeStatus == 0 ? (
          <LargeButton
            title="Check-in"
            onPress={() => handleButton(1)}
            backgroundColor={colors.green}
            loading={loading} // Pass loading prop
          />
        ) : (
          <LargeButton
            title="Undo Check-in"
            onPress={() => handleButton(0)}
            backgroundColor={colors.red}
            loading={loading} // Pass loading prop
          />
        )}
    </ScrollView>
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
    width: 150,
    height: 150,
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
