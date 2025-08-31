import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Hooks
import { useSelector } from 'react-redux';

import { useDeviceInfo } from '../../hooks/badge/useDeviceInfo';
import { useBadgeWebView } from '../../hooks/badge/useBadgeWebView';

// Utils
import { showPrintAlert, showModifyAlert, showRegenerateAlert } from '../../utils/badge/badgeActions';
import { renderBadgeContent } from '../../utils/badge/badgeRenderer';

// Services
import { editAttendee } from '../../services/editAttendeeService';

// Types
import { BadgePreviewStackParamList } from '../../types/badge/badge.types';

import MainHeader from '@/components/elements/header/MainHeader';
import usePrintDocument from '@/printing/hooks/usePrintDocument';
import { RootState } from '@/redux/store';
import colors from '@/assets/colors/colors';

type BadgePreviewScreenRouteProp = RouteProp<BadgePreviewStackParamList, 'BadgePreviewScreen'>;
type BadgePreviewScreenNavigationProp = NativeStackNavigationProp<BadgePreviewStackParamList, 'BadgePreviewScreen'>;

const BadgePreviewScreen: React.FC = () => {
  const route = useRoute<BadgePreviewScreenRouteProp>();
  const navigation = useNavigation<BadgePreviewScreenNavigationProp>();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  // State for forcing badge refresh after regeneration
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { attendeesData } = route.params;
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
    let printSuccess = false;
    
    if (attendeesData.badge_pdf_url && 
        typeof attendeesData.badge_pdf_url === 'string' && 
        attendeesData.badge_pdf_url.trim() !== '') {
      try {
        // Print the badge right away
        await printDocument(attendeesData.badge_pdf_url, undefined, true);
        console.log('Badge sent', {badge_url: attendeesData.badge_pdf_url});
        printSuccess = true;
      } catch (printError) {
        console.error('Error printing badge:', printError);
        // Handle error - could show an alert or update UI state
      }
    } else {
      console.error('Badge PDF URL is empty or invalid:', attendeesData.badge_pdf_url);
      // Handle missing PDF URL - could show an alert
    }
    
    // Fallback to original alert if direct printing fails
    if (!printSuccess) {
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
          first_name: attendeesData.first_name,
          last_name: attendeesData.last_name,
          email: attendeesData.email || 'attendee@example.com',
          phone: attendeesData.phone || '',
          organization: attendeesData.organization || '',
          jobTitle: attendeesData.job_title || '',
          typeId: attendeesData.attendee_type_id || '',
        };
        
        console.log('Regenerating badge with params:', regenerateParams);
        
        // Call the edit attendee API to regenerate the badge
        const response = await editAttendee(regenerateParams);
        
        console.log('Badge regenerated successfully:', response);
        
        // Force refresh of the badge image by updating the refresh key
        setRefreshKey((prev: number) => prev + 1);
        
        // Show success message
        Alert.alert('Succès', 'Le badge a été régénéré avec succès');
        
        // The badge image will be refreshed with the new refreshKey
        
      } catch (error) {
        console.error('Error regenerating badge:', error);
        Alert.alert('Erreur', 'Échec de la régénération du badge. Veuillez réessayer.');
      }
    });
  };



  return (
    <SafeAreaView style={styles.container}>
        <MainHeader onLeftPress={() => navigation.goBack()} title="Badge Preview"/>
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
      <View style={[styles.actionButtons, isTablet && styles.actionButtonsTablet]}>
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