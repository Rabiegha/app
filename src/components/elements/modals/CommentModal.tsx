import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import LoadingView from '../../../components/elements/view/LoadingView';
import ErrorView from '../../../components/elements/view/ErrorView';

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  onAddPress: () => void;
  sessionCount: number;
  partnerCount: number;
  attendeeName: string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  comment: string;
  setComment: (text: string) => void;
  showSuccess?: boolean;
};

const CommentModal = ({
  visible,
  onRequestClose,
  onAddPress,
  attendeeName,
  loading,
  error,
  onRetry,
  comment,
  setComment,
  showSuccess
}: Props) => (
  <Modal
    animationType="fade"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <Pressable style={styles.overlay} onPress={onRequestClose} />

    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onRequestClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {loading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView message={error} handleRetry={onRetry} />
      ) : (
        <>
          {showSuccess ? (
  <Text style={styles.successText}>✅ Commentaire ajouté !</Text>
) : (
  <>
            <Text style={styles.title}>{attendeeName}</Text>

            {/* Title and TextArea */}
            <Text style={styles.commentLabel}>Ajouter un commentaire</Text>
            <TextInput
            style={styles.textArea}
            value={comment}
            onChangeText={setComment}
            placeholder="Écrivez votre commentaire ici..."
            placeholderTextColor={colors.grey}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            />

            <TouchableOpacity style={styles.profileButton} onPress={onAddPress}>
            <Text style={styles.profileButtonText}>Ajouter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onRequestClose}>
            <Text style={styles.fermerText}>Fermer</Text>
            </TouchableOpacity>
        </>
        )}

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
    top: '25%',
    alignSelf: 'center',
    width: '85%',
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
    fontSize: 16,
    marginVertical: 4,
    color: colors.darkGrey,
  },
  commentLabel: {
    alignSelf: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: colors.darkGrey,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: colors.greyCream,
    width: '100%',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    fontSize: 14,
    color: colors.darkGrey,
  },
  profileButton: {
    backgroundColor: colors.green,
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
    color: colors.grey,
    fontSize: 14,
    marginTop: 4,
  },
  successText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.green,
    textAlign: 'center',
    marginVertical: 20,
  },
  
});

export default CommentModal;
