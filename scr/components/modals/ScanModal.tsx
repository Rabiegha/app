import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet, Image} from 'react-native';
import acceptedImage from '../../assets/images/Accepted.png';
import rejectedImage from '../../assets/images/Rejected.png';
import colors from '../../../colors/colors';

const ScanModal = ({onClose, message, visible, isAccepted}) => {
/*   const visible = true;
  const isAccepted = true; */
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.text}>{message}</Text>
          <Image
            source={isAccepted ? acceptedImage : rejectedImage}
            style={styles.image}
          />
        </View>
      </View>
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
    zIndex: 1,
    color: colors.darkGrey,
  },
  videoStyle: {
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
  },
  gifStyle: {
    height: 100,
    width: 100,
  },
  accepted: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
  },
});

export default ScanModal;
