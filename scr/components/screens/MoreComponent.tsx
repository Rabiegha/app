import React from 'react';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import LabelValueComponent from '../elements/LabelValueComponent';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../../colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import userIcon from '../../assets/images/user.png';
import ScanIcon from '../../assets/images/icons/Scan.png';
import SuppIcon from '../../assets/images/icons/Supp.png';


const MoreComponent = ({
  firstName,
  lastName,
  email,
  phone,
  attendeeStatus,
  organization,
  See,
  handleButton,
  Share,
}) => {
  console.log(firstName, lastName, email);

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

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image
          source={userIcon}
          style={styles.image}
        />
      </View>
      <View style={styles.topButtonsContainer}>
        <SmallButton
          imageSource={ScanIcon}
          pressHandler={See}
          backgroundColor={colors.green}
          tintColor={colors.greyCream}
        />
        <SmallButton
          imageSource={SuppIcon}
          pressHandler={Share}
          backgroundColor={colors.red}
          tintColor="white"
        />
      </View>
      <LabelValueComponent
        label="Nom:"
        value={firstName && lastName ? `${firstName} ${lastName}` : '- '}
        value2={undefined}
      />
      <LabelValueComponent
        label="Adresse mail:"
        value={email ? email : '-'}
        value2={undefined}
      />
      <LabelValueComponent
        label="Téléphone:"
        value={phone ? insertSpaceBetweenPairs(phone) : '-'}
        value2={undefined}
      />
      <LabelValueComponent
        label="Entreprise:"
        value={organization ? organization : '-'}
        value2={undefined}
      />
      {attendeeStatus == 0 ? (
        <LargeButton
          title="Check-in"
          onPress={() => handleButton(1)}
          backgroundColor={colors.green}
        />
      ) : (
        <LargeButton
          title="Undo Check-in"
          onPress={() => handleButton(0)}
          backgroundColor={colors.red}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 100,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 35,
  },
});

export default MoreComponent;
