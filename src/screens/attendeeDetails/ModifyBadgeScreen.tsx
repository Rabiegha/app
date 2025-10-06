import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';

// Colors
import colors from '../../assets/colors/colors';

// Components
// Redux
import { editAttendeeThunk, EditAttendeeParams } from '../../features/attendee';
import { AppDispatch } from '../../redux/store';
// Types
import { BadgePreviewStackParamList, AttendeeData } from '../../types/badge/badge.types';
import { RootState } from '../../redux/store';
// Hooks
import useAttendeeTypeDropdown from '../../hooks/type/useAttendeeTypesDropdown';

import MainHeader from '@/components/elements/header/MainHeader';

type ModifyBadgeScreenRouteProp = RouteProp<BadgePreviewStackParamList, 'ModifyBadge'>;
type ModifyBadgeScreenNavigationProp = NativeStackNavigationProp<BadgePreviewStackParamList, 'ModifyBadge'>;

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  attendee_type_id: string;
}

const ModifyBadgeScreen: React.FC = () => {
  const route = useRoute<ModifyBadgeScreenRouteProp>();
  const navigation = useNavigation<ModifyBadgeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  
  const { attendeesData } = route.params;
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { isUpdating } = useSelector((state: RootState) => state.attendee);
  
  // Attendee types dropdown
  const dropdownOptions = useAttendeeTypeDropdown();
  
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    attendee_type_id: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [selectedAttendeeType, setSelectedAttendeeType] = useState<string | null>(null);
  const [hasSelectedType, setHasSelectedType] = useState(false);

  useEffect(() => {
    // Prefill form with attendee data
    if (attendeesData) {
      const attendeeTypeId = attendeesData.attendee_type_id?.toString() || '';
      setFormData({
        first_name: attendeesData.first_name || '',
        last_name: attendeesData.last_name || '',
        email: attendeesData.email || '',
        phone: attendeesData.phone || '',
        organization: attendeesData.organization || '',
        jobTitle: attendeesData.job_title || '',
        attendee_type_id: attendeeTypeId,
      });
    }
  }, [attendeesData]);


  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleEnregistrer = async () => {
    if (!validateForm()) {
      return;
    }

    if (!userInfo?.user_id || !attendeesData?.id) {
      Alert.alert('Erreur', 'Informations utilisateur ou participant manquantes');
      return;
    }

    try {
      const attendeeUpdateData: EditAttendeeParams = {
        userId: userInfo.user_id,
        attendeeId: attendeesData.id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        jobTitle: formData.jobTitle,
        ...(hasSelectedType && { typeId: selectedAttendeeType === null ? '0' : selectedAttendeeType }),
      };

      const result = await dispatch(editAttendeeThunk(attendeeUpdateData));
      
      console.log('Edit attendee result:', result);
      
      if (editAttendeeThunk.fulfilled.match(result)) {
        console.log('✅ Modification réussie, navigation vers BadgePreview');
        
        // Show success toast
        Toast.show({
          type: 'customSuccess',
          text1: 'Participant modifié',
          text2: `${formData.first_name} ${formData.last_name}`,
        });

        // Navigate back to BadgePreview with updated data
        const updatedAttendeeData = {
          ...attendeesData,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          job_title: formData.jobTitle,
        };

        console.log('Navigation vers BadgePreview avec:', updatedAttendeeData);
        
        // Use replace instead of navigate to ensure proper navigation
        navigation.replace('BadgePreviewScreen', {
          attendeesData: updatedAttendeeData,
        });
      } else if (editAttendeeThunk.rejected.match(result)) {
        console.log('❌ Modification échouée:', result.payload);
        const errorMessage = result.payload as string || 'Échec de la modification du participant';
        Alert.alert('Erreur', errorMessage);
      } else {
        console.log('⚠️ Résultat inattendu:', result);
        Alert.alert('Erreur', 'Résultat inattendu de la modification');
      }
    } catch (error) {
      console.error('Error updating attendee:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification');
    }
  };

  const handleAnnuler = () => {
    Alert.alert(
      'Annuler les modifications',
      'Êtes-vous sûr de vouloir annuler ? Toutes les modifications seront perdues.',
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderInput = (
    label: string,
    field: keyof FormData,
    placeholder: string,
    keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default',
    multiline: boolean = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError,
        ]}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        editable={!isUpdating}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MainHeader 
        onLeftPress={() => navigation.goBack()} 
        title="Modifier le participant"
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          {renderInput('Prénom *', 'first_name', 'Entrez le prénom')}
          {renderInput('Nom *', 'last_name', 'Entrez le nom')}
          {renderInput('Email *', 'email', 'Entrez l\'email', 'email-address')}
          
          {/* Attendee Type Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Type de participant</Text>
            {dropdownOptions.length > 0 && (
              <Dropdown
                style={[styles.dropdown, errors.attendee_type_id && styles.inputError]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={dropdownOptions}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Sélectionner un type"
                searchPlaceholder="Rechercher..."
                value={selectedAttendeeType}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                onChange={item => {
                  setSelectedAttendeeType(item.value);
                  setHasSelectedType(true);
                  if (errors.attendee_type_id) {
                    setErrors(prev => ({ ...prev, attendee_type_id: undefined }));
                  }
                }}
                renderItem={item => (
                  <View style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{item.label}</Text>
                    <View style={[styles.colorBox, {backgroundColor: item.color}]} />
                  </View>
                )}
                disable={isUpdating}
              />
            )}
            {errors.attendee_type_id && (
              <Text style={styles.errorText}>{errors.attendee_type_id}</Text>
            )}
          </View>
          
          {renderInput('Téléphone', 'phone', 'Entrez le numéro de téléphone', 'phone-pad')}
          {renderInput('Organisation', 'organization', 'Entrez l\'organisation')}
          {renderInput('Titre du poste', 'jobTitle', 'Entrez le titre du poste')}
        </View>
      </ScrollView>

      <View style={[
        styles.buttonContainer,
        { 
          paddingBottom: Math.max(insets.bottom, 16),
          marginBottom: 16
        }
      ]}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleAnnuler}
          disabled={isUpdating}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.saveButton, isUpdating && styles.disabledButton]}
          onPress={handleEnregistrer}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 8,
    paddingVertical: 14,
  },
  buttonContainer: {
    backgroundColor: colors.white,
    borderTopColor: colors.lightGrey,
    borderTopWidth: 1,
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: colors.grey,
    fontSize: 16,
    fontWeight: '500',
  },
  colorBox: {
    borderRadius: 3,
    height: 20,
    width: 5,
  },
  container: {
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.darkGrey,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dropdownItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  dropdownItemText: {
    color: colors.darkGrey,
    fontSize: 16,
  },
  errorText: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    elevation: 5,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  input: {
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.darkGrey,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputError: {
    borderColor: colors.red,
  },
  inputLabel: {
    color: colors.darkGrey,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputSearchStyle: {
    color: colors.darkGrey,
    fontSize: 16,
    height: 40,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  placeholderStyle: {
    color: colors.grey,
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderRadius: 8,
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: colors.green,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.darkGrey,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  selectedTextStyle: {
    color: colors.darkGrey,
    fontSize: 16,
  },
});

export default ModifyBadgeScreen;