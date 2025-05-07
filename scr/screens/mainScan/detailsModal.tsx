import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import colors from '../../assets/colors/colors';
import LoadingView from '../../components/elements/view/LoadingView';
import ErrorView from '../../components/elements/view/ErrorView';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  onProfilePress: () => void;
  sessionCount: number;
  partnerCount: number;
  attendeeName: string;
  loading: boolean;
  error: string | null;   // string gives you the message
  onRetry: () => void;
};

const DetailsModal = ({
  visible,
  onRequestClose,
  onProfilePress,
  sessionCount,
  partnerCount,
  attendeeName,
  loading,
  error,
  onRetry,
}: Props) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}
  >
    {/* backdrop */}
    <Pressable style={styles.overlay} onPress={onRequestClose} />

    <View style={styles.modalContainer}>
      {/* close (always available) */}
      <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* body */}
      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView
          message={error}
          handleRetry={onRetry}
        />
      ) : (
        <>
          <Text style={styles.title}>{attendeeName}</Text>

          <Text style={styles.text}>
            Nombre de sessions&nbsp;: {sessionCount}
          </Text>
          <Text style={styles.text}>
            Nombre de partenaires&nbsp;: {partnerCount}
          </Text>

          {/* body 
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <Text style={styles.profileButtonText}>Voir le profil</Text>
          </TouchableOpacity>*/}

          <TouchableOpacity style={styles.profileButton} onPress={onRequestClose}>
            <Text style={styles.fermerText}>Fermer</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </Modal>
);



const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    zIndex: 1,
    paddingTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 6,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
  title: {
    fontSize: 18,
    marginVertical: 8,
    color: colors.darkGrey,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
    color: colors.darkGrey,
  },
  profileButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 12,
  },
  profileButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  fermerText: {
    color: 'grey',
    fontSize: 14,
    marginTop: 4,
    color: colors.greyCream,
  },
});

export default DetailsModal;
