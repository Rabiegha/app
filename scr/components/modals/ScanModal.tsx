// src/components/modals/ScanModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';
import printingAnimation from '../../assets/animations/Printing.json';
import acceptedAnimation from '../../assets/animations/Accepted.json';
import rejectedAnimation from '../../assets/animations/Rejected.json';
import noFileAnimation from '../../assets/animations/Rejected.json';
import noPrinterAnimation from '../../assets/animations/Rejected.json';
import colors from '../../../colors/colors';

const ScanModal = ({onClose, visible}) => {
  const printStatus = useSelector(state => state.printers.printStatus);
  /*   const visible = true;
  const printStatus = 'Print successful'; */

  let message = '';
  let animationSource = null;
  let shouldLoop = false;
  let height = 100;

  switch (printStatus) {
    case 'No file exists':
      message = 'No file exists for this attendee.';
      animationSource = noFileAnimation;
      break;
    case 'No printer selected':
      message = 'No printer selected. Please select a printer first.';
      animationSource = noPrinterAnimation;
      break;
    case 'Sending print job':
      message = 'Sending print job...';
      animationSource = printingAnimation;
      height = 150;
      shouldLoop = true;
      break;
    case 'Print successful':
      message = 'Print job done successfully!';
      animationSource = acceptedAnimation;
      break;
    case 'Error printing document':
      message = 'Error sending print job.';
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
      visible={visible && printStatus !== ''}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    top: '40%',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    marginBottom: 10,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  animation: {
    height: 200,
    width: 200,
  },
});

export default ScanModal;
