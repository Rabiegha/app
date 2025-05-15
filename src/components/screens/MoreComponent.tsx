import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import LabelValueComponent from '../elements/LabelValueComponent';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../assets/colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import userIcon from '../../assets/images/user.png';
import Icons from '@/assets/images/icons';
import HoldButton from '../elements/buttons/HoldButton';
import { insertSpaceBetweenPairs } from '../../hooks/useFormat';
import { useSelector } from 'react-redux';
import { selectCurrentUserId, selectUserType } from '../../redux/selectors/auth/authSelectors';
import { attendeeFieldConfig } from '../../utils/modify/attendeeFieldConfig';
import ModifyFieldModal from '../elements/modals/ModifyFieldModal';
import { useUpdateAttendeeField } from '../../hooks/edit/useUpdateAttendeeField';
import { MoreComponentProps, AttendeeData, FieldConfig, BaseField } from './MoreComponent.types';


/**
 * Component for displaying detailed attendee information with edit capabilities
 */
const MoreComponent: React.FC<MoreComponentProps> = ({
  firstName,
  lastName,
  attendeeId,
  email,
  phone,
  attendeeStatus,
  organization,
  JobTitle,
  commentaire,
  attendeeStatusChangeDatetime,
  See,
  Print,
  handleButton,
  loading,
  modify,
  type,
  onFieldUpdateSuccess,
}) => {

  const userId = useSelector(selectCurrentUserId);
  const formattedPhone = insertSpaceBetweenPairs(phone || '');
  const parsedAttendeeStatus = Number(attendeeStatus);
  const userType = useSelector(selectUserType);

  // Determine if user is a partner
const isPartner = userType?.toLowerCase() === 'partner';


const attendeeData: AttendeeData = {
  first_name: firstName,
  last_name: lastName,
  email,
  phone,
  organization,
  jobTitle: JobTitle,
  comment: commentaire,
  typeId: 1, // ou récupéré depuis un autre endroit
};


const [editFieldKey, setEditFieldKey] = useState<string | null>(null);
const [editValue, setEditValue] = useState('');
const [modalVisible, setModalVisible] = useState(false);


const { submitFieldUpdate, loading: updating, error, success } = useUpdateAttendeeField();

const openEditModal = (fieldKey: string) => {
  if (
    !fieldKey ||
    !attendeeFieldConfig ||
    typeof attendeeFieldConfig !== 'object' ||
    !(fieldKey in attendeeFieldConfig)
  ) {
    console.warn('Champ non supporté ou config invalide :', fieldKey);
    return;
  }

  const config = attendeeFieldConfig[fieldKey];
  setEditFieldKey(fieldKey);
  setEditValue(config.accessor(attendeeData));
  setModalVisible(true);
};





const baseFields = [
  {
    label: 'Type:',
    value: type || '-',
  },
  {
    label: 'Nom:',
    value: firstName && lastName ? `${firstName} ${lastName}` : '-',
  },
  {
    fieldKey: 'email',
    label: 'Adresse mail:',
    value: email || '-',
  },
  {
    fieldKey: 'phone',
    label: 'Téléphone:',
    value: formattedPhone || '-',
  },
  {
    fieldKey: 'organization',
    label: 'Entreprise:',
    value: organization || '-',
  },
  {
    fieldKey: 'jobTitle',
    label: 'Job Title:',
    value: JobTitle || '-',
  },
  {
    label: 'Date de check-in:',
    value: parsedAttendeeStatus ? attendeeStatusChangeDatetime : '-',
  },
  {
    fieldKey: 'comment',
    label: 'Commentaire:',
    value: commentaire || '-',
    showForPartnerOnly: true,
    showButton: true,
  },
];


const handleEditSubmit = async (newValue: string) => {
  if (!editFieldKey || !attendeeId || !userId) return false;

  const fieldName = attendeeFieldConfig[editFieldKey]?.fieldName;

  if (!fieldName) {
    console.warn('Champ non mappé pour l’API:', editFieldKey);
    return false;
  }

  try {
    const success = await submitFieldUpdate({
      userId: userId || '',
      attendeeId,
      field: fieldName,
      value: String(newValue), // Convert to string to fix type error
    });
    if (success && typeof onFieldUpdateSuccess === 'function') {
      onFieldUpdateSuccess(); // ✅ trigger parent refresh
    }
    return success;
  } catch (err) {
    return false;
  }
};


  

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={userIcon} style={styles.image} />
      </View>
      <View style={styles.topButtonsContainer}>
        <SmallButton
          imageSource={Icons.Print}
          pressHandler={Print}
          backgroundColor={colors.green}
          tintColor={colors.greyCream}
        />
          {/*  ----  Edit button temporarily disabled  ----  
          // <SmallButton
          //   imageSource={Icons.Modifier}
          //   pressHandler={modify}
          //   backgroundColor={colors.greyCream}
          //   tintColor={colors.darkGrey} 
          // /> */}

        <SmallButton
          imageSource={Icons.Scan}
          pressHandler={See}
          backgroundColor={colors.greyCream}
          tintColor={colors.darkGrey}
        />
      </View>
      <View style={styles.container}>
      {baseFields
        .filter(field => {
          // Type guard to check if field has hideForPartner or showForPartnerOnly properties
          const hasHideForPartner = 'hideForPartner' in field;
          const hasShowForPartnerOnly = 'showForPartnerOnly' in field;
          
          if (isPartner && hasHideForPartner && field.hideForPartner) return false;
          if (!isPartner && hasShowForPartnerOnly && field.showForPartnerOnly) return false;
          return true;
        })
        .map((field, index) => (
          <LabelValueComponent
            key={index}
            label={field.label}
            value={field.value}
            showButton={field.showButton}
            modifyHandle={field.fieldKey ? () => openEditModal(field.fieldKey as string) : undefined}
          />


      ))}

        </View>

      {!isPartner && (
        <>
          {parsedAttendeeStatus === 0 ? (
            <LargeButton
              title="Check-in"
              onPress={() => handleButton && handleButton()}
              backgroundColor={colors.green}
              loading={loading}
            />
          ) : (
            <LargeButton
              title="Undo Check-in"
              onPress={() => handleButton && handleButton()}
              backgroundColor={colors.red}
              loading={loading}
            />
          )}
        </>
      )}
      {modalVisible && editFieldKey && (
        <ModifyFieldModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        label={editFieldKey in attendeeFieldConfig ? attendeeFieldConfig[editFieldKey as keyof typeof attendeeFieldConfig].label : ''}
        initialValue={editValue}
        onSubmit={handleEditSubmit}
      />

      )}

    </ScrollView>
  );
};

/**
 * Styles for the MoreComponent
 */
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
