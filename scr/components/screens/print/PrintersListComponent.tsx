import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectNodePrinterAsync,
  deselectNodePrinterAsync,
} from '../../../redux/slices/printerSlice';
import colors from '../../../assets/colors/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import {getNodePrinters} from '../../../services/printNodeService';
import {getWifiPrinters} from '../../../services/printService';

const PrintersList = () => {
  const [wifiPrinters, setWifiPrinters] = useState([]);
  const [nodePrinters, setNodePrinters] = useState([]);
  const dispatch = useDispatch();
  const [loadingWifiPrinters, setLoadingWifiPrinters] = useState(true);
  const [loadingNodePrinters, setLoadingNodePrinters] = useState(true);
  const [loadingPrinter, setLoadingPrinter] = useState(false);

  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );

  useEffect(() => {
    getWifiPrinters()
      .then(data => setWifiPrinters(data))
      .catch(error => console.error(error))
      .finally(() => setLoadingWifiPrinters(false));
  }, []);

  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const printersList = await getNodePrinters();
        setNodePrinters(printersList);
      } catch (error) {
        Alert.alert('Unable to fetch printers.', 'Error');
      } finally {
        setLoadingNodePrinters(false);
      }
    };
    fetchPrinters();
  }, []);

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

  return (
    <View>
      <Spinner
        visible={loadingWifiPrinters || loadingNodePrinters || loadingPrinter}
        textContent="Loading..."
      />

      {/* Online Printers */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.title}>Online Printers</Text>
        </View>
        {loadingNodePrinters ? (
          <Text>Loading printers...</Text>
        ) : onlinePrinters.length === 0 ? (
          <Text>No online printers available</Text>
        ) : (
          <FlatList
            data={onlinePrinters}
            keyExtractor={item => item.id.toString()}
            style={{ height: 230 }}
            renderItem={({item}) => (
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
        )}
      </View>

      {/* Offline Printers */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.offlineIndicator} />
          <Text style={styles.title}>Offline Printers</Text>
        </View>
        {loadingNodePrinters ? (
          <Text>Loading printers...</Text>
        ) : offlinePrinters.length === 0 ? (
          <Text>No offline printers available</Text>
        ) : (
          <FlatList
            data={offlinePrinters}
            keyExtractor={item => item.id.toString()}
            style={{ height: 230 }}
            renderItem={({item}) => (
              <View
                style={[
                  styles.printerList,
                  {
                    backgroundColor: colors.greyCream,
                  },
                ]}>
                <Text style={[styles.name, {color: colors.grey}]}>
                  {item.name || 'Unknown Printer'}
                </Text>
              </View>
            )}
          />
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
});

export default PrintersList;
