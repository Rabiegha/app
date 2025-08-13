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
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';

// Components
import MainHeader from '@/components/elements/header/MainHeader';

// Redux
import { editAttendeeThunk, EditAttendeeParams } from '../../features/attendee';
import { AppDispatch } from '../../redux/store';

// Types
import { BadgePreviewStackParamList, AttendeeData } from '../../types/badge/badge.types';
import { RootState } from '../../redux/store';

type ModifyBadgeScreenRouteProp = RouteProp<BadgePreviewStackParamList, 'ModifyBadge'>;
type ModifyBadgeScreenNavigationProp = NativeStackNavigationProp<BadgePreviewStackParamList, 'ModifyBadge'>;

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
}

const ModifyBadgeScreen: React.FC = () => {
  const route = useRoute<ModifyBadgeScreenRouteProp>();
  const navigation = useNavigation<ModifyBadgeScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  
  const { attendeesData } = route.params;
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { isUpdating } = useSelector((state: RootState) => state.attendee);
  
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    // Prefill form with attendee data
    if (attendeesData) {
      setFormData({
        first_name: attendeesData.first_name || '',
        last_name: attendeesData.last_name || '',
        email: attendeesData.email || '',
        phone: attendeesData.phone || '',
        organization: attendeesData.organization || '',
        jobTitle: attendeesData.job_title || '',
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
        typeId: attendeesData.attendee_type_id?.toString(),
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
          {renderInput('Téléphone', 'phone', 'Entrez le numéro de téléphone', 'phone-pad')}
          {renderInput('Organisation', 'organization', 'Entrez l\'organisation')}
          {renderInput('Titre du poste', 'jobTitle', 'Entrez le titre du poste')}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ModifyBadgeScreen;