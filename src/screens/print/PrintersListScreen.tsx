import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../assets/colors/colors';
import globalStyle from '../../assets/styles/globalStyle';
import PrintersList from '../../components/screens/print/PrintersListComponent';
import MainHeader from '../../components/elements/header/MainHeader';
import Icons from '../../assets/images/icons';

const PrintersListScreen = ({navigation}) => {
  const handleGoBack = () => {
    navigation.navigate('Print');
  };
  
  // Function to store the refresh function from the child component
  const [refreshPrinters, setRefreshPrinters] = useState<(() => void) | null>(null);
  
  // Callback to receive the refresh function from the child component
  const handleRefreshCallback = useCallback((refreshFunction: () => void) => {
    setRefreshPrinters(() => refreshFunction);
  }, []);
  
  // Handler for the refresh button in the header
  const handleRefreshPress = () => {
    if (refreshPrinters) {
      refreshPrinters();
    }
  };
  
  return (
    <View style={[globalStyle.backgroundWhite, styles.screenContainer]}>
      <MainHeader
        title={'Imprimantes'}
        onLeftPress={handleGoBack}
        onRightPress={handleRefreshPress}
        RightIcon={Icons.refresh}
        rightBottonColor={colors.green}
        size={30}
      />
      <View style={styles.contentContainer}>
        <PrintersList refreshCallback={handleRefreshCallback} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.darkGrey,
  },
});

export default PrintersListScreen;
