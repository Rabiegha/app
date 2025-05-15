// FiltreComponent.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ViewStyle } from 'react-native';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import FiltreDetailsComponent from './FiltreDetailsComponent';
import RedBorderButton from '../elements/buttons/RedBorderButton';
import MainHeader from '../elements/header/MainHeader';
import { FiltreComponentProps, FilterCriteria } from './FiltreComponent.types';

/**
 * Component for filtering attendees by various criteria
 */
const FiltreComponent: React.FC<FiltreComponentProps> = ({
  initialFilter,
  defaultFilter,
  onApply,
  onCancel,
  tout,
  checkedIn,
  notChechkedIn,
  style,
}) => {
  // Local (temporary) state for filters
  const [tempFilterCriteria, setTempFilterCriteria] = useState<FilterCriteria>(initialFilter);

  useEffect(() => {
    setTempFilterCriteria(initialFilter);
  }, [initialFilter]);

  return (
    <View style={[styles.rootContainer, globalStyle.backgroundBlack, style]}>
      <MainHeader
        color={colors.greyCream}
        onLeftPress={onCancel}
        title={'Filtre'}
        backgroundColor={colors.darkGrey}
        onRightPress={() => {}}
        RightIcon={null}
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

/**
 * Styles for the FiltreComponent
 */
const styles = StyleSheet.create<{
  rootContainer: ViewStyle;
  scrollContainer: ViewStyle;
  buttonsColumn: ViewStyle;
  fullWidthButton: ViewStyle;
}>({
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
  buttonsColumn: {
    flexDirection: 'column',
    // We can space them out as needed:
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    marginBottom: 20,
  },
  fullWidthButton: {
    width: '100%', 
    marginBottom: 15,
  },
});
