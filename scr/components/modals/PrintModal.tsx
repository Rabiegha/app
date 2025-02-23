// src/modals/ScanModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import LottieView from 'lottie-react-native';
import acceptedAnimation from '../../assets/animations/Accepted.json';
import rejectedAnimation from '../../assets/animations/Rejected.json';
import printingAnimation from '../../assets/animations/Printing.json';
import colors from '../../assets/colors/colors';

const PrintModal = ({onClose, visible, status}) => {
  if (!visible || !status) {
    return null;
  }

  let message = '';
  let animationSource = null;
  let shouldLoop = false;
  let height = 100;

  switch (status) {
    // Statuts d'impression
    case 'Sending print job':
    case 'printing':
      message = 'Sending print job...';
      animationSource = printingAnimation;
      shouldLoop = true;
      height = 150;
      break;
    case 'Print successful':
      message = 'Print job done successfully!';
      animationSource = acceptedAnimation;
      break;
    case 'Error printing':
      message = 'Error sending print job.';
      animationSource = rejectedAnimation;
      break;
    case 'No printer selected':
      message = 'No printer selected. Please select a printer first.';
      animationSource = rejectedAnimation;
      break;
    default:
      message = '';
      animationSource = null;
      break;
  }

  return (
    <Modal
      transparent={true}
      visible={visible && status !== ''}
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              {message !== '' && <Text style={styles.text}>{message}</Text>}
              {animationSource && (
                <LottieView
                  source={animationSource}
                  autoPlay
                  loop={shouldLoop}
                  style={[styles.animation, {height: height}]}
                />
              )}
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
    justifyContent: 'center', // Centrer verticalement
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    // Ombre optionnelle pour une meilleure visibilité
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    marginBottom: 10,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default PrintModal;
