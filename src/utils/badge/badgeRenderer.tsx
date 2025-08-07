import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image } from 'react-native';
import PinchZoomView from 'react-native-pinch-zoom-view';
import { AttendeeData } from '../../types/badge/badge.types';

interface BadgeRendererProps {
  attendeeData: AttendeeData;
  hasError: boolean;
  imageError: string | null;
  onLoad: () => void;
  onError: (error: any) => void;
  onRetry: () => void;
  refreshKey?: number;
}



export const renderBadgeContent = ({
  attendeeData,
  hasError,
  imageError,
  onLoad,
  onError,
  onRetry,
  refreshKey = 0,
}: BadgeRendererProps) => {
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorMessage}>
          {imageError || 'Impossible de charger le badge'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get the badge image URL - prioritize badge_image_url, then badge_url
  const baseImageUrl = attendeeData.badge_image_url || attendeeData.badge_url;

  if (baseImageUrl) {
    // Cache-busting using attendee data hash and refresh key
    // This will change when attendee data changes OR when badge is regenerated
    const attendeeHash = `${attendeeData.first_name}-${attendeeData.last_name}-${attendeeData.email}`.replace(/\s+/g, '-');
    const separator = baseImageUrl.includes('?') ? '&' : '?';
    const badgeImageUrl = `${baseImageUrl}${separator}cb=${attendeeHash}&refresh=${refreshKey}`;
    
    console.log('🖼️ Badge image URL with cache-busting:', badgeImageUrl);

    return (
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Chargement du badge...</Text>
          </View>
        )}
        <PinchZoomView style={styles.zoomContainer}>
          <Image
            key={attendeeHash} // Force React Native to treat this as a new image
            source={{ 
              uri: badgeImageUrl,
              cache: 'reload' // Force reload from server
            }}
            style={styles.badgeImage}
            resizeMode="contain"
            onLoad={() => {
              setIsLoading(false);
              onLoad();
            }}
            onError={(error) => {
              setIsLoading(false);
              onError(error);
            }}
          />
        </PinchZoomView>
      </View>
    );
  }

  // If badge_html is available, we could potentially extract image URLs from it
  // For now, we'll show the no badge message if no image URL is available

  return (
    <View style={styles.noBadgeContainer}>
      <Text style={styles.noBadgeText}>Aucun badge disponible</Text>
      <Text style={styles.noBadgeSubtext}>
        Le badge n'a pas encore été généré pour cet participant
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    maxWidth: 400,
    maxHeight: 600,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noBadgeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  noBadgeSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
