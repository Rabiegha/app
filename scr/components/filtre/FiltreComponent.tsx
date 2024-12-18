// MenuScreen.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import HeaderComponent from '../elements/header/HeaderComponent';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import FiltreDetailsComponent from './FiltreDetailsComponent';
import RedBorderButton from '../elements/buttons/RedBorderButton';

const FiltreComponent = ({
  handlePress,
  filterCriteria,
  setFilterCriteria,
  tout,
  checkedIn,
  notChechkedIn,
}) => {
  /* const sections = [
    {
      title: 'Etats',
      buttons: [
        {title: 'Tous les participants'},
        {title: 'Checked-in'},
        {title: 'Not checked-in'},
      ],
    },
  ]; */

  return (
    <View style={globalStyle.backgroundBlack}>
      <HeaderComponent
        title={'Filtre'}
        color={colors.greyCream}
        handlePress={handlePress}
      />
      <View style={[globalStyle.container, globalStyle.container]}>
        <View>
          {filterCriteria && (
            <FiltreDetailsComponent
              filterCriteria={filterCriteria}
              setFilterCriteria={setFilterCriteria}
              tout={tout}
              checkedIn={checkedIn}
              notChechkedIn={notChechkedIn}
            />
          )}
        </View>
        <RedBorderButton onPress={() => handlePress()} Titre={'Fermer'} />
      </View>
    </View>
  );
};

export default FiltreComponent;
