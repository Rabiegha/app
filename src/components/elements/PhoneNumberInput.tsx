import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ListRenderItemInfo,
} from 'react-native';
import down from '../../assets/images/down.png';
import globalStyle from '../../assets/styles/globalStyle';
import { countryData } from '../../assets/countryData';
import { PhoneInputProps, CountryData } from './PhoneNumberInput.types';

const {width} = Dimensions.get('window');

/**
 * Phone number input component with country code selector
 */
const PhoneInput: React.FC<PhoneInputProps> = ({
  phoneNumber,
  onChangeText,
  placeholder,
  placeholderTextColor,
  containerStyle,
  inputStyle,
}) => {
  const [areas, setAreas] = useState<CountryData[]>([]);
  const [selectedArea, setSelectedArea] = useState<CountryData | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [localPhoneNumber, setLocalPhoneNumber] = useState<string>(selectedArea?.dial_code || '');

  // Load the country data directly from the file
  useEffect(() => {
    setAreas(countryData);
    if (countryData.length > 0) {
      let defaultData = countryData.filter(a => a.code == 'FR');
      if (defaultData.length > 0) {
        setSelectedArea(defaultData[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedArea) {
      setLocalPhoneNumber(''); // Reset phone number when country code changes
      onChangeText(selectedArea.dial_code);
    }
  }, [selectedArea]);

  // Handle the change in the phone number input
  const handlePhoneNumberChange = (text: string): void => {
    setLocalPhoneNumber(text);
    if (selectedArea) {
      onChangeText(selectedArea.dial_code + text);
    }
  };

  // Render countries codes modal
  const renderAreasCodesModal = () => {
    const renderItem = ({ item }: ListRenderItemInfo<CountryData>): React.ReactElement => {
      return (
        <TouchableOpacity
          style={{
            paddingVertical: 10,
            flexDirection: 'row',
          }}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}>
          <Text style={{fontSize: 24}}>
            {item.flag}
          </Text>

          <Text style={{fontSize: 16, color: '#000'}}>{item.name}</Text>
        </TouchableOpacity>
      );
    };

    return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 400,
                width: width * 0.8,
                backgroundColor: '#fff',
                borderRadius: 12,
              }}>
              <FlatList
                data={areas}
                renderItem={renderItem}
                keyExtractor={item => item.code}
                showsVerticalScrollIndicator={false}
                style={{padding: 20}}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={[globalStyle.input, containerStyle]}>
      <View style={[styles.inputContainer, inputStyle]}>
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={() => setModalVisible(true)}>
          <View style={styles.countryCodeIconContainer}>
            <Image source={down} style={styles.countryCodeIcon} />
          </View>

          <View style={styles.countryFlagContainer}>
            <Text style={{fontSize: 24}}>
              {selectedArea?.flag}
            </Text>
          </View>

          <View style={styles.countryCodeTextContainer}>
            <Text style={styles.countryCodeText}>
              {selectedArea?.dial_code}
            </Text>
          </View>
        </TouchableOpacity>
        <TextInput
          style={styles.phoneNumberInput}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          selectionColor="#111"
          keyboardType="numeric"
          value={localPhoneNumber}
          onChangeText={handlePhoneNumberChange}
        />
      </View>
      {renderAreasCodesModal()}
    </View>
  );
};

/**
 * Styles for the PhoneInput component
 */
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
  },
  countryCodeButton: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
    marginRight: 5,
  },
  countryCodeIconContainer: {
    justifyContent: 'center',
  },
  countryCodeIcon: {
    width: 10,
    height: 5,
    tintColor: '#111',
  },
  countryFlagContainer: {
    justifyContent: 'center',
    marginLeft: 5,
  },
  countryFlag: {
    width: 20,
    height: 20,
  },
  countryCodeTextContainer: {
    justifyContent: 'center',
    marginLeft: 5,
  },
  countryCodeText: {
    color: '#111',
    fontSize: 15,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    height: 22,
    padding: 0,
  },
});

export default PhoneInput;
