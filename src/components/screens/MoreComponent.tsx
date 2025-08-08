import React, { useState } from 'react';
import {ScrollView, StyleSheet, View, Image} from 'react-native';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import LabelValueComponent from '../elements/LabelValueComponent';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../assets/colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import userIcon from '../../assets/images/user.png';
import Icons from '../../assets/images/icons';
import { selectCurrentUserId, selectUserType } from '../../redux/selectors/auth/authSelectors';
import { attendeeFieldConfig } from '../../utils/modify/attendeeFieldConfig';
import ModifyFieldModal from '../elements/modals/ModifyFieldModal';
import { useUpdateAttendeeField } from '../../hooks/edit/useUpdateAttendeeField';




//Props types
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
  isLoadingDetails: boolean;
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
  isLoadingDetails,
  type,
  onFieldUpdateSuccess,
}: MoreComponentProps) => {

//User state

const userId = useSelector(selectCurrentUserId);

//User type
const userType = useSelector(selectUserType);

//Attendee status
// Explicitly convert attendeeStatus to number to avoid type issues
const parsedAttendeeStatus = typeof attendeeStatus === 'string' ? parseInt(attendeeStatus, 10) : attendeeStatus;



// Determine if user is a partner
const isPartner = userType?.toLowerCase() === 'partner';


// Make sure this structure matches the Attendee interface in attendeeFieldConfig.ts
const attendeeData = {
  email,
  phone,
  organization,
  jobTitle: JobTitle,
  comment: commentaire,
  firstName,
  lastName,
};


//Edit modal
const [editFieldKey, setEditFieldKey] = useState<string | null>(null);
// Explicitly define editValue as string type only
const [editValue, setEditValue] = useState<string>('');
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
  setEditFieldKey(String(fieldKey));
  
  // Get the value from the accessor and explicitly convert to string
  // This ensures we're always passing a string to setEditValue
  const rawValue = config.accessor(attendeeData);
  setEditValue(String(rawValue));
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
    fieldKey: 'firstName',
    label: 'Prénom:',
    value: firstName || '-',
    showButton: true,
    hideForPartner: false,
  },
  {
    fieldKey: 'lastName',
    label: 'Nom:',
    value: lastName || '-',
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
    value: phone || '-',
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
    value: (parsedAttendeeStatus === 1) && attendeeStatusChangeDatetime && attendeeStatusChangeDatetime !== '-' ? 
      String(attendeeStatusChangeDatetime) : '-',
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

const testing = true;
//Render skeleton or content
const renderSkeletonOrContent = (label: string, value: string, showButton?: boolean, fieldKey?: keyof typeof attendeeFieldConfig) => {
  if (isLoadingDetails || testing) {
    return (
      <View style={styles.skeletonContainer}>
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width={100} height={15} borderRadius={4} marginBottom={5} />
          <SkeletonPlaceholder.Item width="80%" height={20} borderRadius={4} />
        </SkeletonPlaceholder>
      </View>
    );
  }

  return (
    <LabelValueComponent
      label={label}
      value={value}
      showButton={showButton && (isPartner ? false : true)}
      modifyHandle={
        fieldKey && showButton
          ? () => openEditModal(fieldKey)
          : undefined
      }
    />
  );
};



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
    console.error('Erreur lors de la mise à jour du champ:', err);
    return false;
  }
};

  return (
    <ScrollView
    contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}>
      <View style={styles.topContainer}>
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
      </View>

      <View style={styles.container}>
      {baseFields
        .filter(field => {
          // For partners, hide fields marked as hideForPartner
          if (isPartner && field.hideForPartner) return false;
          // For non-partners, hide fields marked as showForPartnerOnly
          if (!isPartner && field.showForPartnerOnly) return false;
          return true;
        })
        .map((field) => {
          // For debugging - log each field being rendered
          // console.log(`Rendering field ${index}:`, field);
          return renderSkeletonOrContent(
            field.label,
            field.value,
            field.showButton,
            field.fieldKey
          );
        })}

        </View>
      {modalVisible && editFieldKey && (
        <ModifyFieldModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        label={attendeeFieldConfig[editFieldKey]?.label || ''}
        initialValue={editValue || ''}
        onSubmit={handleEditSubmit}
      />

      )}

{!isPartner && (
  <View style={styles.bottomContainer}>
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
  </View>
       
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    marginBottom: 20,
  },
  container: {
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
  skeletonContainer: {
     marginBottom: 15, 
     width: '100%'
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  topContainer: {
    alignItems: 'center',
  },
});

export default MoreComponent;
