import React from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

//components
import {CheckBox} from 'react-native-elements';
import {Dropdown} from 'react-native-element-dropdown';

//styles
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import Icons from '../../assets/images/icons';


interface addAttendeesComponentProps {
  handleEnregistrer: () => void;
  handleCheckboxPress: () => void;
  setNom: (text: string) => void;
  setPrenom: (text: string) => void;
  setEmail: (text: string) => void;
  setSociete: (text: string) => void;
  setJobTitle: (text: string) => void;
  setNumeroTelephone: (text: string) => void;
  nom: string;
  prenom: string;
  email: string;
  societe: string;
  jobTitle: string;
  isChecked: boolean;
  numeroTelephone: string;
  inputErrors: Record<string, boolean>;
  resetInputError: (field: string) => void;
  attendeeTypes: Record<string, string>[];
  selectedAttendeeType: string;
  setSelectedAttendeeType: (value: string) => void;
}

const AddAttendeesComponent = ({
  handleEnregistrer ,
  handleCheckboxPress,
  setNom,
  setPrenom,
  setEmail,
  setSociete,
  setJobTitle,
  setNumeroTelephone,
  nom,
  prenom,
  email,
  societe,
  jobTitle,
  isChecked,
  numeroTelephone,
  inputErrors,
  resetInputError,
  attendeeTypes,
  selectedAttendeeType,
  setSelectedAttendeeType,
} :addAttendeesComponentProps) => {

  return (
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
        {/* Societe */}
        <TextInput
          style={globalStyle.input}
          placeholderTextColor={colors.grey}
          placeholder="Société"
          value={societe}
          onChangeText={text => setSociete(text)}
        />
        <Text style={[styles.error, {opacity: 0}]}>Champ requis</Text>
        {/* Menu déroulant pour sélectionner le type d'attendee */}
        <Dropdown
          style={globalStyle.input}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
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
              source={Icons.NotChecked}
              resizeMode="contain"
              style={styles.checkBoxImage}
            />
          }
          uncheckedIcon={
            <Image
              source={Icons.Checked}
              resizeMode="contain"
              style={styles.checkBoxImage}
            />
          }
          checked={isChecked}
          onPress={handleCheckboxPress}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
        />
        <TouchableOpacity style={styles.button} onPress={handleEnregistrer}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.green,
    borderRadius: 10,
    color: colors.darkGrey,
    marginTop: 20,
    padding: 15,
    width: '100%',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
  },
  checkBoxContainer: {
    alignSelf: 'flex-start',
    borderWidth: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 20,
    padding: 0,
  },
  checkBoxImage: {
    height: 20,
    tintColor: colors.darkGrey,
    width: 20,
  },
  checkBoxText: {
    color: colors.darkGrey,
    marginLeft: 10,
  },
  colorBox: {
    borderRadius: 3,
    height: 20,
    marginRight: 10,
    width: 5,
  },
  container: {
    flexGrow: 1,
    height: 1000,
    padding: 20,
    top: 30,
    width: '100%',
  },
  error: {
    color: colors.red,
    fontSize: 10,
    margin: 0,
    marginTop: 5,
    padding: 0,
  },
  inputSearchStyle: {
    color: colors.darkGrey,
    fontSize: 16,
    height: 40,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  itemText: {
    color: colors.darkGrey,
  },
  placeholderStyle: {
    color: colors.grey,
  },
  selectedTextStyle: {
    color: colors.darkGrey,
    fontSize: 16,
  },
});

export default AddAttendeesComponent;
