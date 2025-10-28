import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// eslint-disable-next-line import/order
import { CommonActions } from '@react-navigation/native';

// Hooks
import { useSelector } from 'react-redux';

import { useDeviceInfo } from '../../hooks/badge/useDeviceInfo';
import { useBadgeWebView } from '../../hooks/badge/useBadgeWebView';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';

// Utils
import { showPrintAlert, showModifyAlert, showRegenerateAlert } from '../../utils/badge/badgeActions';
import { renderBadgeContent } from '../../utils/badge/badgeRenderer';

// Services
import { editAttendee } from '../../services/editAttendeeService';

// Types
import { BadgePreviewStackParamList, AttendeeData } from '../../types/badge/badge.types';

import MainHeader from '@/components/elements/header/MainHeader';
import usePrintDocument from '@/printing/hooks/usePrintDocument';
import CheckinPrintModal from '@/components/elements/modals/CheckinPrintModal';
import { RootState } from '@/redux/store';
import colors from '@/assets/colors/colors';

// Type for handling both snake_case and camelCase formats
type RawAttendeeData = AttendeeData & {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  urlBadgePdf?: string;
  urlBadgeImage?: string;
};

// Data normalization function to handle both snake_case and camelCase formats
const normalizeAttendeeData = (data: RawAttendeeData): AttendeeData => {
  return {
    id: data.id,
    first_name: data.first_name || data.firstName || '',
    last_name: data.last_name || data.lastName || '',
    email: data.email,
    phone: data.phone,
    organization: data.organization,
    job_title: data.job_title || data.jobTitle,
    attendee_type_id: data.attendee_type_id,
    badge_url: data.badge_url,
    badge_pdf_url: data.badge_pdf_url || data.urlBadgePdf,
    badge_image_url: data.badge_image_url || data.urlBadgeImage,
  };
};

type BadgePreviewScreenRouteProp = RouteProp<BadgePreviewStackParamList, 'BadgePreviewScreen'>;
type BadgePreviewScreenNavigationProp = NativeStackNavigationProp<BadgePreviewStackParamList, 'BadgePreviewScreen'>;

const BadgePreviewScreen: React.FC = () => {
  const route = useRoute<BadgePreviewScreenRouteProp>();
  const navigation = useNavigation<BadgePreviewScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  // State for forcing badge refresh after regeneration
  const [refreshKey, setRefreshKey] = useState(0);
  // State for attendee data that can be updated after regeneration
  const [attendeesData, setAttendeesData] = useState(() => {
    const { attendeesData: rawAttendeesData } = route.params;
    // Normalize the data to handle both snake_case and camelCase formats
    return normalizeAttendeeData(rawAttendeesData);
  });
  // Custom hooks
  const { isTablet } = useDeviceInfo();
  const {
    hasError,
    webViewError,
    handleWebViewLoad,
    handleWebViewError,
    handleRetry,
    resetState,
  } = useBadgeWebView();
  const { status: printStatus, clearStatus } = usePrintStatus();

  useEffect(() => {
    // Configuration initiale si nécessaire
    navigation.setOptions({
      title: `Badge - ${attendeesData.first_name} ${attendeesData.last_name}`,
      headerBackTitle: 'Retour',
    });
  }, [navigation, attendeesData]);

  // Action handlers using extracted utilities
  //PRINT
  const { printDocument } = usePrintDocument();
  const handlePrint = async () => {
    if (attendeesData.badge_pdf_url && 
        typeof attendeesData.badge_pdf_url === 'string' && 
        attendeesData.badge_pdf_url.trim() !== '') {
      try {
        // Print the badge - this will automatically show the modal via printStatus
        await printDocument(attendeesData.badge_pdf_url, undefined, true);
        console.log('Badge sent', {badge_url: attendeesData.badge_pdf_url});
      } catch (printError) {
        console.error('Error printing badge:', printError);
        // Error status will be handled by the modal via printStatus
      }
    } else {
      console.error('Badge PDF URL is empty or invalid:', attendeesData.badge_pdf_url);
      // Fallback to original alert if no valid PDF URL
      showPrintAlert();
    }
  };
  
  const handleModify = () => {
    showModifyAlert(() => {
      // Navigation vers l'écran de modification
      navigation.navigate('ModifyBadge', { attendeesData });
    });
  };

  const handleRegenerate = () => {
    showRegenerateAlert(async () => {
      try {
        resetState();
        
        // Check if userInfo is available
        if (!userInfo) {
          console.error('User info not available');
          return;
        }
        
        // Prepare regeneration parameters using available AttendeeData properties
        const regenerateParams = {
          userId: userInfo.user_id,
          attendeeId: attendeesData.id,
        };
        
        console.log('Regenerating badge with params:', regenerateParams);
        
        // Call the edit attendee API to regenerate the badge
        const response = await editAttendee(regenerateParams);
        
        console.log('Badge regenerated successfully:', response);
        
        // Update attendee data with new badge URLs from the response
        if (response && response.data) {
          const updatedData = normalizeAttendeeData(response.data);
          setAttendeesData(updatedData);
          console.log('Updated attendee data with new badge URLs:', {
            old_pdf_url: attendeesData.badge_pdf_url,
            new_pdf_url: updatedData.badge_pdf_url,
            old_image_url: attendeesData.badge_image_url,
            new_image_url: updatedData.badge_image_url
          });
        }
        
        // Force refresh of the badge image by updating the refresh key
        setRefreshKey((prev: number) => prev + 1);
        
        // Show success message
        Alert.alert('Succès', 'Le badge a été régénéré avec succès');
        
        // The badge image will be refreshed with the new refreshKey and print will use new PDF URL
        
      } catch (error) {
        console.error('Error regenerating badge:', error);
        Alert.alert('Erreur', 'Échec de la régénération du badge. Veuillez réessayer.');
      }
    });
  };



  return (
    <SafeAreaView style={styles.container}>
        <MainHeader onLeftPress={() => navigation.dispatch(
          CommonActions.navigate({
            name: 'Tabs',
            params: {
              screen: 'EventDashboard',
              params: {
                screen: 'AttendeesList'
              }
            }
          })
        )} title="Badge Preview"/>
      {/* Informations du participant */}
      <View style={[styles.headerInfo, isTablet && styles.headerInfoTablet]}>
        <Text style={styles.attendeeName}>
          {attendeesData?.first_name} {attendeesData?.last_name}
        </Text>
        <Text style={styles.attendeeEmail}>{attendeesData?.email}</Text>
        {attendeesData?.organization && (
          <Text style={styles.attendeeOrganization}>{attendeesData?.organization}</Text>
        )}
      </View>

      {/* Aperçu du badge */}
      <View style={[styles.badgeContainer, isTablet && styles.badgeContainerTablet]}>
        {renderBadgeContent({
          attendeeData: attendeesData,
          hasError,
          imageError: webViewError,
          onLoad: handleWebViewLoad,
          onError: handleWebViewError,
          onRetry: handleRetry,
          refreshKey: refreshKey,
        })}
      </View>

      {/* Boutons d'action */}
      <View style={[
        styles.actionButtons, 
        isTablet && styles.actionButtonsTablet,
        { 
          paddingBottom: Math.max(insets.bottom, 16),
          marginBottom: 16
        }
      ]}>
        <TouchableOpacity style={[styles.button, styles.printButton]} onPress={handlePrint}>
          <Text style={styles.buttonText}>Imprimer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.modifyButton]} onPress={handleModify}>
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.regenerateButton]} onPress={handleRegenerate}>
          <Text style={styles.buttonText}>Régénérer</Text>
        </TouchableOpacity>
      </View>

      {/* 🖨️ Print modal */}
      {printStatus && (
        <CheckinPrintModal
          visible={true}
          status={printStatus}
          onClose={clearStatus}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    backgroundColor: colors.white,
    borderTopColor: colors.grey,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  actionButtonsTablet: {
    alignSelf: 'center',
    maxWidth: 600,
    paddingHorizontal: 32,
    paddingVertical: 20,
    width: '100%',
  },
  attendeeEmail: {
    color: colors.darkerGrey,
    fontSize: 16,
    marginBottom: 2,
  },
  attendeeName: {
    color: colors.darkerGrey,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  attendeeOrganization: {
    color: colors.darkerGrey,
    fontSize: 14,
    fontStyle: 'italic',
  },
  badgeContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
    margin: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeContainerTablet: {
    alignSelf: 'center',
    margin: 32,
    maxWidth: 600,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  headerInfo: {
    backgroundColor: colors.white,
    borderBottomColor: colors.greyCream,
    borderBottomWidth: 1,
    padding: 16,
  },
  headerInfoTablet: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  modifyButton: {
    backgroundColor: colors.yellow,
  },
  printButton: {
    backgroundColor: colors.green,
  },
  regenerateButton: {
    backgroundColor: colors.blue,
  },
});

export default BadgePreviewScreen;