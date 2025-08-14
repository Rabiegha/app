import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import Spinner from 'react-native-loading-spinner-overlay';

import colors from '@/assets/colors/colors';
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
  const closeTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // ✅ Reset value when modal reopens with a new field
  useEffect(() => {
    if (visible) {
      setValue(initialValue);
      setError('');
      setSuccess(false);
    }
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [visible, initialValue]);

  const unchanged = value.trim() === (initialValue ?? '').trim();

  const handleSubmit = useCallback(async () => {

    if (loading || success) return; // guard double taps
    
    setLoading(true);
    setError('');

    const start = Date.now();
    const MIN_SPIN_MS = 350;

    try {
      const result = await onSubmit(value);
      if (result) {
        setSuccess(true);
        closeTimerRef.current = setTimeout(onClose, 1500);
      } else {
        setError('Une erreur est survenue.');
      }
    } catch (err) {
      setError('Erreur inattendue.' + err);
    } finally {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_SPIN_MS - elapsed);
      setTimeout(() => setLoading(false), wait);
    }
  }, [value, onSubmit, onClose, loading, success]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Spinner visible={loading} />
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
              style={[styles.button, styles.confirm, loading || unchanged ? {backgroundColor: colors.lightGreen} : null]}
              disabled={loading || success || unchanged}
            >
              <Text style={styles.buttonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  cancel: {
    backgroundColor: colors.red,
  },
  confirm: {
    backgroundColor: colors.green,
  },
  error: {
    color: colors.red,
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    color: colors.darkGrey,
    fontSize: 16,
    minHeight: 120,
    padding: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  success: {
    color: colors.green,
    fontWeight: 'bold',
    marginTop: 15,
  },
  title: {
    color: colors.darkGrey,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ModifyFieldModal;
