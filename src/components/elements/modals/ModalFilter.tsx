import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';

const ModalFilter = ({isVisible, closeModal}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            width: 300,
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 10,
          }}>
          <Text>Your Modal Content Goes Here</Text>
          <TouchableOpacity
            style={{marginTop: 10, alignSelf: 'flex-end'}}
            onPress={closeModal}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalFilter;
