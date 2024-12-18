import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import SuccessComponent from '../elements/notifications/SuccessComponent';
import FailComponent from '../elements/notifications/FailComponent';
import {CheckBox} from 'react-native-elements';
import colors from '../../assets/colors/colors';
import notChecked from '../../assets/images/icons/Not-checked.png';
import Checked from '../../assets/images/icons/Checked.png';
import {Picker} from '@react-native-picker/picker';
import {Dropdown} from 'react-native-element-dropdown';

const AddAttendeesComponent = ({
  onPress,
  handleCheckboxPress,
  setNom,
  setPrenom,
  setEmail,
  setSociete,
  setJobTitle,
  setSuccess,
  setNumeroTelephone,
  nom,
  prenom,
  email,
  societe,
  jobTitle,
  isChecked,
  success,
  numeroTelephone,
  inputErrors,
  resetInputError,
  attendeeTypes,
  selectedAttendeeType,
  setSelectedAttendeeType,
  attendeeColor,
}) => {
  useEffect(() => {
/*     console.log('Success value:', success);
    console.log('attendee types:', attendeeTypes);
    console.log('attendee color:', attendeeColor); */
  }, [success]);

  return (
    <View
      style={styles.wrapper}
      contentContainerStyle={styles.contentContainer}>
      {/*       {true && (
        <SuccessComponent
          style={styles.notif}
          onClose={() => setSuccess(null)}
          text={'Participant ajouté avec succès'}
        />
      )}
      {success === false && (
        <FailComponent
          style={styles.notif}
          onClose={() => setSuccess(null)}
          text={'Participant non ajouté'}
        />
      )} */}

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Nom */}
        <TextInput
          style={[
            globalStyle.input,
            inputErrors.nom && {
              backgroundColor: colors.lightRed,
              borderColor: colors.red,
            },
          ]}
          placeholder="Nom"
          placeholderTextColor={inputErrors.nom ? colors.red : colors.grey}
          value={nom}
          onChangeText={text => {
            setNom(text);
            resetInputError('nom');
          }}
        />
        <Text style={[styles.error, {opacity: inputErrors.nom ? 1 : 0}]}>
          Ce champ est requis *
        </Text>
        {/* Prénom */}
        <TextInput
          style={[
            globalStyle.input,
            inputErrors.prenom && {
              backgroundColor: colors.lightRed,
              borderColor: colors.red,
            },
          ]}
          placeholder="Prénom"
          placeholderTextColor={inputErrors.prenom ? colors.red : colors.grey}
          value={prenom}
          onChangeText={text => {
            setPrenom(text);
            resetInputError('prenom');
          }}
        />
        <Text style={[styles.error, {opacity: inputErrors.prenom ? 1 : 0}]}>
          Ce champ est requis *
        </Text>
        {/* Menu déroulant pour sélectionner le type d'attendee */}
        <Dropdown
          style={globalStyle.input}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={attendeeTypes}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Attendee Type"
          searchPlaceholder="Search..."
          value={selectedAttendeeType}
          onChange={item => {
            setSelectedAttendeeType(item.value);
            console.log('selected type id', selectedAttendeeType);
          }}
          renderItem={item => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.label}</Text>
              <View style={[styles.colorBox, {backgroundColor: item.color}]} />
            </View>
          )}
        />
        <Text style={[styles.error, {opacity: 0}]} />
        {/* Email */}
        <TextInput
          style={[
            globalStyle.input,
            inputErrors.email && {
              backgroundColor: colors.lightRed,
              borderColor: colors.red,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={inputErrors.email ? colors.red : colors.grey}
          value={email}
          onChangeText={text => {
            setEmail(text);
            resetInputError('email');
          }}
          keyboardType="email-address"
        />
        <Text style={[styles.error, {opacity: inputErrors.email ? 1 : 0}]}>
          Veuillez entrer une adresse email valide *
        </Text>
        {/* Téléphone */}
        <TextInput
          style={[
            globalStyle.input,
            inputErrors.numeroTelephone && {
              backgroundColor: colors.lightRed,
              borderColor: colors.red,
            },
          ]}
          placeholder="Téléphone"
          placeholderTextColor={
            inputErrors.numeroTelephone ? colors.red : colors.grey
          }
          value={numeroTelephone}
          onChangeText={text => {
            setNumeroTelephone(text);
            resetInputError('numeroTelephone');
          }}
          keyboardType="numeric"
        />
        <Text
          style={[
            styles.error,
            {opacity: inputErrors.numeroTelephone ? 1 : 0},
          ]}>
          Veuillez entrer un numéro de téléphone valide *
        </Text>
        {/*  <PhoneInput
          phoneNumber={numeroTelephone}
          placeholder="Téléphone"
          placeholderTextColor={
            inputErrors.numeroTelephone ? colors.red : colors.grey
          }
          onChangeText={text => {
            setNumeroTelephone(text);
            resetInputError('numeroTelephone');
          }}
        /> */}
        {/* Societe */}
        <TextInput
          style={globalStyle.input}
          placeholderTextColor={colors.grey}
          placeholder="Société"
          value={societe}
          onChangeText={text => setSociete(text)}
        />
        <Text style={[styles.error, {opacity: 0}]}>Champ requis</Text>
        {/* Job Title */}
        <TextInput
          style={globalStyle.input}
          placeholderTextColor={colors.grey}
          placeholder="Job Title"
          value={jobTitle}
          onChangeText={text => setJobTitle(text)}
        />
        {/* Checked-in or not */}
        <CheckBox
          title={'Check-in'}
          checkedIcon={
            <Image
              source={notChecked}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: colors.darkGrey,
              }}
            />
          }
          uncheckedIcon={
            <Image
              source={Checked}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: colors.darkerGrey,
              }}
            />
          }
          checked={isChecked}
          onPress={handleCheckboxPress}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
        />

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 30,
    flexGrow: 1,
    padding: 20,
    width: '100%',
    height: 900,
  },
  wrapper: {
    top: 25,
  },
  button: {
    backgroundColor: colors.green,
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    color: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    marginBottom: 0,
    padding: 0,
    borderWidth: 0,
    alignSelf: 'flex-start',
  },
  checkBoxText: {
    color: 'black',
    marginLeft: 10,
  },
  contentContainer: {
    paddingBottom: 300,
  },
  error: {
    color: colors.red,
    fontSize: 10,
    margin: 0,
    padding: 0,
    marginTop: 5,
  },
  notif: {
    zIndex: 100,
  },
  picker: {
    marginRight: -15,
    marginTop: -30,
    height: 50,
  },
  label: {
    color: colors.grey,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: colors.darkGrey,
  },
  placeholderStyle: {
    color: colors.grey,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  colorBox: {
    width: 5,
    height: 20,
    marginRight: 10,
    borderRadius: 3, // pour avoir des coins légèrement arrondis
  },
});

export default AddAttendeesComponent;
