import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import { useDispatch, useSelector } from 'react-redux';
import CustomSwitch from '../components/elements/Switch';
import { setSearchByCompanyMode } from '../redux/slices/searchModeSlice';

const SearchSettingsScreen = ({navigation}) => {
    const dispatch = useDispatch();

    const isSearchByCompanyMode = useSelector(state => state.search.isSearchByCompanyMode);

      const handleSwitchToggle = () => {
        dispatch(setSearchByCompanyMode(!isSearchByCompanyMode));
        console.log('Auto Print mis à jour:', !isSearchByCompanyMode);
      };


  return (
    <View style={globalStyle.backgroundBlack}>
      <HeaderComponent
        title={'Paramètres de recherche'}
        color={colors.greyCream}
        handlePress={() => navigation.goBack()}
      />
      <View style={globalStyle.container}>
        <View style={{top: 60}}>
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={styles.text}>Search By Company Mode</Text>
                    <CustomSwitch value={isSearchByCompanyMode} onValueChange={handleSwitchToggle} />
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

export default SearchSettingsScreen;
