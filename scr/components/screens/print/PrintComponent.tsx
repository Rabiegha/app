import React, {useEffect, useState} from 'react';
import {Image, Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../../../assets/colors/colors';
import LargeButton from '../../elements/buttons/LargeButton';
import Acceder from '../../../assets/images/icons/Acceder.png';
import CustomSwitch from '../../elements/Switch';
import Slider from '@react-native-community/slider';
import Paysage from '../../../assets/images/icons/Paysage.png';
import Portrait from '../../../assets/images/icons/Portrait.png';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {setOption, setAutoPrint} from '../../../redux/slices/printerSlice';
import {
  selectOrientation,
  selectDpi,
  selectAutoPrint,
} from '../../../redux/selectors/printerSelectors';

const PrintComponent = ({navigateBack}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //navigation
  const navigateToPrinters = () => {
    navigation.navigate('Printers');
  };
  const navigateToPaperFormat = () => {
    navigation.navigate('PaperFormat');
  };

  // Sélecteurs Redux

  const orientation = useSelector(selectOrientation);
  const dpi = useSelector(selectDpi);
  const autoPrint = useSelector(selectAutoPrint);

  const dpiPercentage = Math.round((dpi * 100) / 600);

  // Fonction pour gérer le toggle du switch Auto Print
  const handleSwitchToggle = () => {
    dispatch(setAutoPrint(!autoPrint));
    console.log('Auto Print mis à jour:', !autoPrint);
  };
  //options

  // Fonction pour sélectionner l'orientation
  const handleSelectOrientation = value => {
    dispatch(setOption({optionName: 'orientation', value}));
    console.log('Orientation sélectionnée:', value);
  };

  // Fonction pour sélectionner le DPI
  const dpiValues = [0, 150, 300, 450, 600];

  const handleSelectDpi = valueIndex => {
    if (valueIndex < 1) {
      // Prevent selecting values below 25%
      valueIndex = 1;
    }
    const selectedDpi = dpiValues[valueIndex]; // Map index to DPI value
    dispatch(setOption({optionName: 'dpi', value: selectedDpi}));
  };

  const getResolutionText = dpiPercentage => {
    if (dpiPercentage === 0) {
      return 'Très basse résolution';
    } else if (dpiPercentage <= 25) {
      return 'Basse résolution';
    } else if (dpiPercentage <= 50) {
      return 'Résolution moyenne';
    } else if (dpiPercentage <= 75) {
      return 'Haute résolution';
    } else {
      return 'Très haute résolution';
    }
  };

  return (
    <View style={styles.container}>
      {/* Section Printers */}
      <TouchableOpacity
        onPress={navigateToPrinters}
        style={[
          styles.listItemContainer,
          {flexDirection: 'row', height: 50, alignItems: 'center'},
        ]}>
        <Text style={styles.title}>Imprimantes</Text>
        <View style={styles.backButton}>
          <Image
            source={Acceder}
            resizeMode="contain"
            style={{
              width: 16,
              height: 16,
              tintColor: colors.darkGrey,
            }}
          />
        </View>
      </TouchableOpacity>
      {/* Section Format papier */}
      <TouchableOpacity
        onPress={navigateToPaperFormat}
        style={[
          styles.listItemContainer,
          {flexDirection: 'row', height: 50, alignItems: 'center'},
        ]}>
        <Text style={styles.title}>Format papier</Text>
        <TouchableOpacity onPress={undefined} style={styles.backButton}>
          <Image
            source={Acceder}
            resizeMode="contain"
            style={{
              width: 18,
              height: 18,
              tintColor: colors.darkGrey,
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {/* Section Orientation */}
      <View
        style={[
          styles.listItemContainer,
          {flexDirection: 'row', paddingTop: 17},
        ]}>
        <Text style={styles.title}>Orientation</Text>
        <View style={styles.orientationButtons}>
          {/* Bouton Portrait */}
          <TouchableOpacity
            onPress={() => handleSelectOrientation('portrait')}
            style={[
              styles.buttonWrapper,
              orientation === 'portrait'
                ? {
                    backgroundColor: colors.lighterGreen,
                    borderColor: colors.green,
                  }
                : {backgroundColor: colors.grey, borderColor: colors.darkGrey},
            ]}>
            <Text
              style={{
                color:
                  orientation === 'portrait' ? colors.green : colors.darkGrey,
                fontWeight: '200',
                textAlign: 'center',
              }}>
              Portrait
            </Text>
            <View style={styles.backButton}>
              <Image
                source={Portrait}
                style={[
                  styles.buttonImage,
                  {
                    tintColor:
                      orientation === 'portrait'
                        ? colors.green
                        : colors.darkGrey,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
          {/* Bouton Paysage */}
          <TouchableOpacity
            onPress={() => handleSelectOrientation('landscape')}
            style={[
              styles.buttonWrapper,
              orientation === 'landscape'
                ? {
                    backgroundColor: colors.lighterGreen,
                    borderColor: colors.green,
                  }
                : {backgroundColor: colors.grey, borderColor: colors.darkGrey},
            ]}>
            <Text
              style={{
                color:
                  orientation === 'landscape' ? colors.green : colors.darkGrey,
                fontWeight: '200',
                textAlign: 'center',
              }}>
              Paysage
            </Text>
            <View style={styles.backButton}>
              <Image
                source={Paysage}
                style={[
                  styles.buttonImage,
                  {
                    tintColor:
                      orientation === 'landscape'
                        ? colors.green
                        : colors.darkGrey,
                  },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {/* Section Auto Print */}
      <View
        style={[
          styles.listItemContainer,
          {flexDirection: 'row', height: 50, alignItems: 'center'},
        ]}>
        <Text style={styles.title}>Auto Print</Text>
        <CustomSwitch value={autoPrint} onValueChange={handleSwitchToggle} />
      </View>
      {/* Section Qualité d'impression */}
      <View
        style={[
          styles.listItemContainer,
          {flexDirection: 'column', paddingTop: 17, marginBottom: 25},
        ]}>
        <View style={styles.ResolutionWrapper}>
          <Text style={styles.title}>
            Qualité d'impression: {dpiPercentage}%
          </Text>
          <Text style={styles.textResolution}>
            {getResolutionText(dpiPercentage)}
          </Text>
        </View>
        <Slider
          style={{width: '100%', marginBottom: 0}}
          minimumValue={0}
          maximumValue={dpiValues.length - 1}
          minimumTrackTintColor={colors.green}
          maximumTrackTintColor={colors.darkGrey}
          step={1}
          value={dpiValues.indexOf(dpi)} // Bind the current quality value
          onValueChange={valueIndex => handleSelectDpi(valueIndex)} // Update the value on change
        />
      </View>
      <LargeButton
        title={'Appliquer'}
        onPress={navigateBack}
        backgroundColor={colors.green}
        loading={undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  listItemContainer: {
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  ResolutionWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  textResolution: {
    fontWeight: '200',
    fontSize: 11,
  },
  itemName: {
    fontSize: 18,
    top: 50,
  },
  orientationButtons: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    justifyContent: 'center',
    borderRadius: 5,
    marginLeft: 10,
    padding: 15,
    borderWidth: 1,
  },
  buttonImage: {
    height: 60,
    width: 60,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default PrintComponent;
