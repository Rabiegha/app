import React, {useEffect, useState} from 'react';
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
  ScrollView,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import down from '../../assets/images/down.png';
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../../colors/colors';

const {width, height} = Dimensions.get('window');

const PhoneInput = ({phoneNumber, onChangeText}) => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch codes from restcountries API
  useEffect(() => {
    fetch('https://restcountries.com/v2/all')
      .then(response => response.json())
      .then(data => {
        let areaData = data.map(item => {
          return {
            code: item.alpha2Code,
            name: item.name,
            alpha2Code: item.alpha2Code.toLowerCase(),
            callingCode: `+${item.callingCodes}`,
            flag: `https://flagcdn.com/40x30/${item.alpha2Code.toLowerCase()}.png`,
          };
        });
        setAreas(areaData);
        if (areaData.length > 0) {
          let defaultData = areaData.filter(a => a.code == 'FR');

          if (defaultData.length > 0) {
            setSelectedArea(defaultData[0]);
          }
        }
      });
  }, []);
  useEffect(() => {
    // Opérations à exécuter suite à la mise à jour de selectedArea
    console.log('Nouvelle zone sélectionnée:', selectedArea);
  }, [selectedArea]);

  // Render countries codes modal
  const renderAreasCodesModal = () => {
    const renderItem = ({item}) => {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            flexDirection: 'row',
          }}
          onPress={() => {
            setSelectedArea(item);
            setModalVisible(false);
          }}>
          <Image
            source={{uri: item.flag}}
            style={{
              height: 30,
              width: 30,
              marginRight: 10,
            }}
          />

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
                verticalScrollIndicator={false}
                style={{
                  padding: 20,
                  marginBottom: 20,
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <View style={globalStyle.input}>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.countryCodeButton}
          onPress={() => setModalVisible(true)}>
          <View style={styles.countryCodeIconContainer}>
            <Image source={down} style={styles.countryCodeIcon} />
          </View>

          <View style={styles.countryFlagContainer}>
            <Image
              source={{uri: selectedArea?.flag}}
              resizeMode="contain"
              style={styles.countryFlag}
            />
          </View>

          <View style={styles.countryCodeTextContainer}>
            <Text style={styles.countryCodeText}>
              {selectedArea?.callingCode}
            </Text>
          </View>
        </TouchableOpacity>
        <TextInput
          style={styles.phoneNumberInput}
          placeholder="Numéro de téléphone"
          placeholderTextColor={colors.grey}
          selectionColor="#111"
          keyboardType="numeric"
          value={phoneNumber}
          onChangeText={onChangeText}
        />
      </View>
      {renderAreasCodesModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
  },
  countryCodeButton: {
    width: 75,
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
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
