// FiltreComponent.ts

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import FiltreDetailsComponent from './FiltreDetailsComponent';
import RedBorderButton from '../elements/buttons/RedBorderButton'; // assume we can override styles
import MainHeader from '../elements/header/MainHeader';

// Define the filter criteria type
interface FilterCriteria {
  status: string;
  company: null;
  // Add other filter properties if needed based on your application's requirements
}

// Define props interface for the component
interface FiltreComponentProps {
  initialFilter: FilterCriteria;
  defaultFilter: FilterCriteria;
  onApply: (filter: FilterCriteria) => void;
  onCancel: () => void;
  tout?: number | boolean;
  checkedIn?: number | boolean;
  notChechkedIn?: number | boolean;
}

const FiltreComponent: React.FC<FiltreComponentProps> = ({
  initialFilter,
  onApply,
  onCancel,
  tout,
  checkedIn,
  notChechkedIn,
}) => {
  // Local (temporary) state for filters
  const [tempFilterCriteria, setTempFilterCriteria] = useState(initialFilter);

  useEffect(() => {
    setTempFilterCriteria(initialFilter);
  }, [initialFilter]);

  return (
    <View style={[styles.rootContainer, globalStyle.backgroundBlack]}>
      <MainHeader
        color={colors.greyCream}
        onLeftPress={onCancel}
        title={'Filtre'}
        backgroundColor= {colors.darkGrey}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer} nestedScrollEnabled
 >
        <FiltreDetailsComponent
          filterCriteria={tempFilterCriteria}
          setFilterCriteria={setTempFilterCriteria}
          tout={tout}
          checkedIn={checkedIn}
          notChechkedIn={notChechkedIn}
        />

        {/* Buttons in a column */}
        <View style={styles.buttonsColumn}>
          {/* Cancel Button (Red) */}
          <RedBorderButton
            onPress={onCancel}
            Titre={'Cancel'}
            // Optionally style to make it full-width or something
            color={colors.red}
            style={{ width: '100%' }}
          />

          {/* Apply Button (Green) */}
          <RedBorderButton
            onPress={() => onApply(tempFilterCriteria)}
            Titre={'Apply'}
            color={colors.green}
            style={{ width: '100%' }}

          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FiltreComponent;

const styles = StyleSheet.create({
  buttonsColumn: {
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 20,
    marginTop: 20,
    width: '100%',
  },
  rootContainer: {
    flex: 1, 
    position: 'relative',
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    width: '100%',
  },
});
