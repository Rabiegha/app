import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import { useDispatch, useSelector } from 'react-redux';
import CustomSwitch from '../../components/elements/Switch';
import { setKioskMode } from '../../redux/slices/scanModeSlice';
import MainHeader from '../../components/elements/header/MainHeader';

const ScanSettingsScreen = ({navigation}) => {
    const dispatch = useDispatch();

    const isKioskMode = useSelector(state => state.scan.isKioskMode);

      const handleSwitchToggle = () => {
        dispatch(setKioskMode(!isKioskMode));
        console.log('Auto Print mis à jour:', !isKioskMode);
      };

      const handleGoBack = () => {
        navigation.goBack();
      };


  return (
    <View style={globalStyle.backgroundBlack}>
      <MainHeader
        title={'Paramètres du scanner'}
        onLeftPress={handleGoBack}
        backgroundColor={colors.darkGrey}
        color={colors.greyCream}
      />
      <View style={globalStyle.container}>
        <View style={{top: 60}}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.text}>Kiosk mode</Text>
                    <CustomSwitch value={isKioskMode} onValueChange={handleSwitchToggle} />
                </View>
            </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  container: {
    padding: 20,
    backgroundColor: colors.darkerGrey,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  text: {
    fontSize: 13,
    color: colors.greyCream,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default ScanSettingsScreen;
