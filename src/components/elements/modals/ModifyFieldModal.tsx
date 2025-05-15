import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import colors from '../../../assets/colors/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  label: string;
  initialValue: string;
  onSubmit: (newValue: string) => Promise<boolean>;
};

const ModifyFieldModal = ({ visible, onClose, label, initialValue, onSubmit }: Props) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // ✅ Reset value when modal reopens with a new field
  useEffect(() => {
    if (visible) {
      setValue(initialValue);
      setError('');
      setSuccess(false);
    }
  }, [visible, initialValue]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await onSubmit(value);
      if (result) {
        setSuccess(true);
        setTimeout(onClose, 1500);
      } else {
        setError('Une erreur est survenue.');
      }
    } catch (err) {
      setError('Erreur inattendue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
          <Text style={styles.title}>Modifier le {label}</Text>

          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            editable={!loading && !success}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder={`Entrez un nouveau ${label.toLowerCase()}...`}
            placeholderTextColor={colors.grey}
          />

          {success && <Text style={styles.success}>✅ Modification enregistrée !</Text>}
          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.button, styles.confirm]}
              disabled={loading || success}
            >
              <Text style={styles.buttonText}>{loading ? '...' : 'Enregistrer'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.darkGrey,
  },
  input: {
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: colors.darkGrey,
    minHeight: 120,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancel: {
    backgroundColor: colors.red,
  },
  confirm: {
    backgroundColor: colors.green,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  success: {
    marginTop: 15,
    color: colors.green,
    fontWeight: 'bold',
  },
  error: {
    marginTop: 15,
    color: colors.red,
    fontWeight: 'bold',
  },
});

export default ModifyFieldModal;
