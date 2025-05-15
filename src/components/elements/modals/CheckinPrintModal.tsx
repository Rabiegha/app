import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../../assets/colors/colors';
import { printStatusConfig } from '../../../printing/constants/printStatusConfig';

type Props = {
  visible: boolean;
  status: keyof typeof printStatusConfig | null;
  onClose: () => void;
};

const CheckinPrintModal = ({ visible, status, onClose }: Props) => {
  // 1️⃣  Ne rends rien si invisible OU pas de status
  if (!visible || !status) return null;

  const config = status ? printStatusConfig[status] : undefined;

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}   // 2️⃣  on laisse React gérer
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.text}>{config?.message}</Text>
              <LottieView
                source={config?.animation}
                autoPlay
                loop={config?.loop}
                style={[styles.animation, { height: config?.height }]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    marginBottom: 10,
    color: colors.darkGrey,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  animation: {
    width: 200,
  },
});

export default CheckinPrintModal;
