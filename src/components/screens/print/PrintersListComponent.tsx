import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectNodePrinterAsync,
  deselectNodePrinterAsync,
} from '../../../redux/slices/printerSlice';
import colors from '../../../assets/colors/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import {getNodePrinters} from '../../../services/printNodeService';
import refreshIcon from '../../../assets/images/icons/refresh.png';
import ErrorView from '../../elements/view/ErrorView';

const PrintersList = () => {
  const [wifiPrinters, setWifiPrinters] = useState([]);
  const [nodePrinters, setNodePrinters] = useState([]);
  const dispatch = useDispatch();
  const [loadingWifiPrinters, setLoadingWifiPrinters] = useState(true);
  const [loadingNodePrinters, setLoadingNodePrinters] = useState(true);
  const [loadingPrinter, setLoadingPrinter] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [error, setError] = useState(false);
 

  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );


  const fetchPrinters = useCallback(async (withSpinner: boolean) => {
    if (withSpinner) setLoadingNodePrinters(true);
    setError(false);
    const timeout = setTimeout(() => {
      setLoadingNodePrinters(false);
      setError(true);
    }, 10000); // timeout après 5s
  
    try {
      const printersList = await getNodePrinters();
      clearTimeout(timeout);
      setNodePrinters(printersList);
    } catch (err) {
      clearTimeout(timeout);
      setError(true);
      Alert.alert('Erreur', 'Impossible de récupérer les imprimantes.');
    } finally {
      setLoadingNodePrinters(false);
      setRefreshing(false);
    }
  }, []);
  

  /* initial load */
  useEffect(() => {
    fetchPrinters(true);
  }, [fetchPrinters]);

  const triggerRefresh = () => {
    setRefreshing(true);
    fetchPrinters(false);                 // pas de spinner plein-écran
  };

  const onlinePrinters = nodePrinters.filter(
    printer => printer.state === 'online',
  );
  const offlinePrinters = nodePrinters.filter(
    printer => printer.state === 'offline',
  );

  const handleSelectNodePrinter = async printer => {
    setLoadingPrinter(true);
    try {
      if (selectedNodePrinter && selectedNodePrinter.name === printer.name) {
        await dispatch(deselectNodePrinterAsync()).unwrap();
      } else {
        await dispatch(selectNodePrinterAsync(printer)).unwrap();
      }
    } catch (error) {
      Alert.alert('Error', 'Operation failed. Try again.');
    } finally {
      setLoadingPrinter(false);
    }
  };

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <ErrorView handleRetry={() => fetchPrinters(true)} />
      </View>
    );
  }
  
  return (
    <View>
      <Spinner
        visible={loadingNodePrinters || loadingPrinter}
        textContent="Loading..."
      />

      {/* 🔁 Bouton de reload */}
      <TouchableOpacity style={styles.imageContainee} onPress={triggerRefresh}>
              <Image style={styles.reloadImage} source={refreshIcon} />
            </TouchableOpacity>

      {/* Online Printers */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.title}>Online Printers</Text>
        </View>
        {loadingNodePrinters ? (
          <Text style={styles.status}>Loading printers...</Text>
        ) : onlinePrinters.length > 0 ? (
          <FlatList
            data={onlinePrinters}
            keyExtractor={item => item.id.toString()}
            refreshing={refreshing} 
            onRefresh={triggerRefresh}
            style={{ height: 230 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectNodePrinter(item)}
                style={[
                  styles.printerList,
                  {
                    backgroundColor:
                      selectedNodePrinter && selectedNodePrinter.id === item.id
                        ? colors.detailsGreen
                        : colors.greyCream,
                  },
                ]}>
                <Text
                  style={[
                    styles.name,
                    {
                      color:
                        selectedNodePrinter &&
                        selectedNodePrinter.id === item.id
                          ? 'white'
                          : colors.darkGrey,
                      fontWeight:
                        selectedNodePrinter &&
                        selectedNodePrinter.id === item.id
                          ? '800'
                          : '400',
                    },
                  ]}>
                  {item.name || 'Unknown Printer'}
                </Text>
                <Text
                  style={[
                    styles.state,
                    {
                      color:
                        selectedNodePrinter &&
                        selectedNodePrinter.id === item.id
                          ? 'white'
                          : colors.darkGrey,
                      fontWeight:
                        selectedNodePrinter &&
                        selectedNodePrinter.id === item.id
                          ? '800'
                          : '400',
                    },
                  ]}>
                  {`(${item.state})`}
                </Text>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.emptyMessage}>No online printers available</Text>
        )}
      </View>

      {/* Offline Printers */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.offlineIndicator} />
          <Text style={styles.title}>Offline Printers</Text>
        </View>
        {loadingNodePrinters ? (
          <Text style={styles.status}>Loading printers...</Text>
        ) : offlinePrinters.length > 0 ? (
          <FlatList
            data={offlinePrinters}
            keyExtractor={item => item.id.toString()}
            style={{ height: 230 }}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.printerList,
                  {
                    backgroundColor: colors.greyCream,
                  },
                ]}>
                <Text style={[styles.name, { color: colors.grey }]}>
                  {item.name || 'Unknown Printer'}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyMessage}>No offline printers available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 350,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    marginRight: 8,
  },
  offlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGrey,
  },
  printerList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.greyCream,
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  state: {
    fontSize: 12,
    fontWeight: '200',
  },
  status: {
    color: colors.darkGrey,
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: 'center',
    marginVertical: 10,
  },
  reloadImage: {
    height: 30,
    width: 30,
    tintColor: colors.green,
  },
  imageContainee: {
    height: 30,
    width: 30,
    position: 'absolute',
    right: 25,
    top: -15,
    zIndex: 20,

  },

});

export default PrintersList;
