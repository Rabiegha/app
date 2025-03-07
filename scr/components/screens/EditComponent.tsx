import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import SuccessComponent from '../elements/notifications/SuccessComponent';
import FailComponent from '../elements/notifications/FailComponent';
import colors from '../../assets/colors/colors';
import {useFocusEffect} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import CustomInput from '../elements/CustomInput';

const EditAttendeesComponent = ({
  onPress,
  setNom,
  setPrenom,
  setEmail,
  setNumeroTelephone,
  setSociete,
  setJobTitle,
  setType,
  setTypeId,
  setSuccess,
  nom,
  prenom,
  email,
  numeroTelephone,
  societe,
  jobTitle,
  type,
  typeId,
  success,
  inputErrors,
  resetInputError,
  attendeeTypes,
}) => {
  // Helper function to limit phone number to 9 digits


  const handlePhoneNumberChange = (text = '') => {
    if (typeof text !== 'string') {
      return; // Prevent errors if text is null or undefined
    }

    // Remove the '+' character if the text starts with '+'
    if (text.startsWith('+')) {
      text = text.slice(1); // Remove the '+' character
    }

    // Limit to 9 digits
    setNumeroTelephone(text);
    resetInputError('numeroTelephone');

    return text;
  };
  useEffect(() => {
    console.log('type', type);
  }, [type]);

  return (
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Non */}
        <CustomInput label="Nom" value={nom} onChangeText={(text) => { setNom(text); resetInputError("nom"); } } error={inputErrors.nom} errorMessage={'Champ requis*'} />
        <Text style={[styles.error, {opacity: inputErrors.nom ? 1 : 0}]}>Champ requis*</Text>
        {/* Prenom */}
        <CustomInput label="Prénom" value={prenom} onChangeText={(text) => { setPrenom(text); resetInputError("prenom"); } } error={inputErrors.prenom} errorMessage={'Champ requis*'} />
        <Text style={[styles.error, {opacity: inputErrors.prenom ? 1 : 0}]}>Champ requis*</Text>
         {/* Email */}
        <CustomInput label="Email" value={email} onChangeText={(text) => { setEmail(text); resetInputError("email"); } } error={inputErrors.email} errorMessage={'Veuillez entrer une adresse email valide *'} />
         {/* Societe */}
         <Text style={styles.text}>Société</Text>
        <TextInput
          style={globalStyle.input}
          placeholderTextColor={colors.darkGrey}
          value={societe ?? ""}
          onChangeText={text => setSociete(text)}
        />
        <Text style={[styles.error, {opacity: 0}]}>Champ requis</Text>
        {/* Type */}
        <Text style={styles.text}>Type</Text>
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
          placeholder={type ? type : "Sélectionner un type"}
          searchPlaceholder="Search..."
          value={typeId}
          onChange={item => {
            setTypeId(item.value);
            setType(item.label);
            console.log('selected type id', typeId);
          }}
          renderItem={item => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.label}</Text>
              <View style={[styles.colorBox, {backgroundColor: item.color}]} />
            </View>
          )}
        />
        <Text style={[styles.error, {opacity: 0}]}>Champ requis</Text>
        {/* Telephone */}
        <CustomInput label="Téléphone" value={numeroTelephone ?? ""} onChangeText={text => {
          setNumeroTelephone(handlePhoneNumberChange(text));
          resetInputError('numero de telephone');
        } } error={undefined} errorMessage={undefined} />
        {/* Job title */}
        <CustomInput label="Job Title" value={jobTitle ?? ""} onChangeText={text => setJobTitle(text)} errorMessage={undefined} error={undefined} />

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Enregistrer les modifications</Text>
        </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    marginTop: 5,
    marginLeft: 10,
    color: colors.darkGrey,
  },
  textNom: {
    marginLeft: 10,
    color: colors.darkGrey,
  },
  container: {
    top: 30,
    flexGrow: 1,
    padding: 20,
    width: '100%',
    height: 1300,
  },
  wrapper: {
    top: 25,
  },
  button: {
    backgroundColor: '#77CB8F',
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
  itemText: {
    color: colors.darkGrey,
  },
});

export default EditAttendeesComponent;
