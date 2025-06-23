import React, { useState } from 'react';
import {ScrollView, StyleSheet, View, Image, Text} from 'react-native';
import { useSelector } from 'react-redux';

import LabelValueComponent from '../elements/LabelValueComponent';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../assets/colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import userIcon from '../../assets/images/user.png';
import Icons from '../../assets/images/icons';
import { insertSpaceBetweenPairs } from '../../hooks/useFormat';
import { selectCurrentUserId, selectUserType } from '../../redux/selectors/auth/authSelectors';
import { attendeeFieldConfig } from '../../utils/modify/attendeeFieldConfig';
import ModifyFieldModal from '../elements/modals/ModifyFieldModal';
import { useUpdateAttendeeField } from '../../hooks/edit/useUpdateAttendeeField';


interface MoreComponentProps {
  firstName: string;
  lastName: string;
  attendeeId: string;
  email: string;
  phone: string;
  attendeeStatus: string | number;
  organization: string;
  JobTitle: string;
  commentaire: string;
  attendeeStatusChangeDatetime: string;
  See: () => void;
  PrintAndCheckIn: () => void;
  handleCheckinButton: (status: 0 | 1) => Promise<void>;
  loading: boolean;
  modify: () => void;
  type: string;
  onFieldUpdateSuccess?: () => void;
}

const MoreComponent = ({
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
  PrintAndCheckIn,
  handleCheckinButton,
  loading,
  type,
  onFieldUpdateSuccess,
}: MoreComponentProps) => {

  const userId = useSelector(selectCurrentUserId);
  const formattedPhone = insertSpaceBetweenPairs(phone);
  const parsedAttendeeStatus = Number(attendeeStatus);
  const userType = useSelector(selectUserType);

  // Determine if user is a partner
const isPartner = userType?.toLowerCase() === 'partner';

// Log for debugging
console.log('User type:', userType, 'Is partner:', isPartner);


const attendeeData = {
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


const { submitFieldUpdate } = useUpdateAttendeeField();

const openEditModal = (fieldKey: keyof typeof attendeeFieldConfig) => {
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





// Define the type for our field items
type FieldItem = {
  label: string;
  value: string;
  showButton?: boolean;
  hideForPartner?: boolean;
  showForPartnerOnly?: boolean;
  fieldKey?: keyof typeof attendeeFieldConfig;
};

const baseFields: FieldItem[] = [
  {
    label: 'Type:',
    value: type || '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    label: 'Nom:',
    value: firstName && lastName ? `${firstName} ${lastName}` : '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    fieldKey: 'email',
    label: 'Adresse mail:',
    value: email || '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    fieldKey: 'phone',
    label: 'Téléphone:',
    value: formattedPhone || '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    fieldKey: 'organization',
    label: 'Entreprise:',
    value: organization || '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    fieldKey: 'jobTitle',
    label: 'Job Title:',
    value: JobTitle || '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    label: 'Date de check-in:',
    value: parsedAttendeeStatus === 1 && attendeeStatusChangeDatetime && attendeeStatusChangeDatetime !== '-' ? 
      attendeeStatusChangeDatetime : '-',
    hideForPartner: false,
  },
  {
    fieldKey: 'comment',
    label: 'Commentaire:',
    value: commentaire || '-',
    showForPartnerOnly: true,
    showButton: true,
    hideForPartner: false,
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
      userId,
      attendeeId,
      field: fieldName,
      value: newValue,
    });
    if (success && typeof onFieldUpdateSuccess === 'function') {
      onFieldUpdateSuccess();
    }
    return success;
  } catch (err) {
    return false;
  }
};


  

  // For debugging - log the data being received
  // console.log('Rendering MoreComponent with data:', {
  //   firstName, lastName, email, phone, attendeeStatus, organization, JobTitle, commentaire
  // });

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <Image source={userIcon} style={styles.image} />
      </View>
      {!isPartner && (
        <View style={styles.topButtonsContainer}>
          <SmallButton
                imageSource={Icons.Print}
            pressHandler={PrintAndCheckIn}
            backgroundColor={colors.green}
            tintColor={colors.greyCream}
          />
          <SmallButton
                imageSource={Icons.Scan}
            pressHandler={See}
            backgroundColor={colors.greyCream}
            tintColor={colors.darkGrey}
          />
        </View>
      )}
      <View style={styles.container}>
      {baseFields
        .filter(field => {
          // For partners, hide fields marked as hideForPartner
          if (isPartner && field.hideForPartner) return false;
          // For non-partners, hide fields marked as showForPartnerOnly
          if (!isPartner && field.showForPartnerOnly) return false;
          return true;
        })
        .map((field, index) => {
          // For debugging - log each field being rendered
          // console.log(`Rendering field ${index}:`, field);
          return (
            <LabelValueComponent
              key={index}
              label={field.label}
              value={field.value}
              showButton={field.showButton && (isPartner ? false : true)}
              modifyHandle={field.fieldKey && field.showButton ? () => openEditModal(field.fieldKey as keyof typeof attendeeFieldConfig) : undefined}
            />
          );
        })}

        </View>

      {!isPartner && (
        <>
          {parsedAttendeeStatus === 0 ? (
            <LargeButton
              title="Check-in"
              onPress={() => handleCheckinButton(1)}
              backgroundColor={colors.green}
              loading={loading}
            />
          ) : (
            <LargeButton
              title="Undo Check-in"
              onPress={() => handleCheckinButton(0)}
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
        label={attendeeFieldConfig[editFieldKey]?.label || ''}
        initialValue={editValue}
        onSubmit={handleEditSubmit}
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
  image: {
    borderRadius: 40,
    height: 150,
    width: 150,
  },
  imageContainer: {
    marginBottom: 10,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});

export default MoreComponent;
