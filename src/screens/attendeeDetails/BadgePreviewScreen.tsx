import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Hooks
import { useDeviceInfo } from '../../hooks/badge/useDeviceInfo';
import { useBadgeWebView } from '../../hooks/badge/useBadgeWebView';

// Utils
import { showPrintAlert, showModifyAlert, showRegenerateAlert } from '../../utils/badge/badgeActions';
import { renderBadgeContent } from '../../utils/badge/badgeRenderer';

// Services
import { editAttendee } from '../../services/editAttendeeService';

// Types
import { BadgePreviewStackParamList, AttendeeData } from '../../types/badge/badge.types';
import MainHeader from '@/components/elements/header/MainHeader';
import usePrintDocument from '@/printing/hooks/usePrintDocument';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';

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
    isLoading,
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
    
    if (attendeesData.badge_url && 
        typeof attendeesData.badge_url === 'string' && 
        attendeesData.badge_url.trim() !== '') {
      try {
        // Print the badge right away
        await printDocument(attendeesData.badge_url, undefined, true);
        printSuccess = true;
      } catch (printError) {
        console.error('Error printing badge:', printError);
        // Handle error - could show an alert or update UI state
      }
    } else {
      console.error('Badge PDF URL is empty or invalid:', attendeesData.badge_url);
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
        setRefreshKey(prev => prev + 1);
        
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerInfoTablet: {
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  attendeeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  attendeeEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  attendeeOrganization: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  badgeContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeContainerTablet: {
    margin: 32,
    maxWidth: 600,
    alignSelf: 'center',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noBadgeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  noBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  noBadgeSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  actionButtonsTablet: {
    paddingHorizontal: 32,
    paddingVertical: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  printButton: {
    backgroundColor: '#4CAF50',
  },
  modifyButton: {
    backgroundColor: '#FF9800',
  },
  regenerateButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BadgePreviewScreen;