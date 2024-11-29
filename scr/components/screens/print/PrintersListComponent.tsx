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
  selectWiFiPrinter,
  deselectWiFiPrinter,
  selectNodePrinter,
  deselectNodePrinter,
  selectNodePrinterAsync,
  deselectNodePrinterAsync,
} from '../../../redux/slices/printerSlice';
import colors from '../../../../colors/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import {getWifiPrinters, getNodePrinters} from '../../../services/serviceApi';

const PrintersList = () => {
  const [wifiPrinters, setWifiPrinters] = useState([]);
  const [nodePrinters, setNodePrinters] = useState([]);
  const dispatch = useDispatch();
  const [loadingWifiPrinters, setLoadingWifiPrinters] = useState(true);
  const [loadingNodePrinters, setLoadingNodePrinters] = useState(true);
  const [loadingPrinter, setLoadingPrinter] = useState(false);

  // selected wifi printers
  const selectedWiFiPrinters = useSelector(
    state => state.printers.selectedPrinters,
  );

  // selected node printer
  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );

  // Fetch Wi-Fi printers
  useEffect(() => {
    getWifiPrinters()
      .then(data => {
        setWifiPrinters(data);
      })
      .catch(error => console.error(error))
      .finally(() => setLoadingWifiPrinters(false));
  }, []);

  // Fetch PRINTNODE printers
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

  // online and offline printers
  const onlinePrinters = nodePrinters.filter(
    printer => printer.state === 'online',
  );
  const offlinePrinters = nodePrinters.filter(
    printer => printer.state === 'offline',
  );

  // Handle PrintNode printer selection
  const handleSelectNodePrinter = async printer => {
    setLoadingPrinter(true);

    try {
      if (selectedNodePrinter && selectedNodePrinter.name === printer.name) {
        await dispatch(deselectNodePrinterAsync());
      } else {
        await dispatch(selectNodePrinterAsync(printer));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select the printer. Try again.');
    } finally {
      setLoadingPrinter(false);
    }
  };

/*   useEffect(() => {
    const interval = setInterval(() => {
      fetchPrinters();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []); */

  return (
    <View>
      <Spinner
        visible={loadingWifiPrinters || loadingNodePrinters || loadingPrinter}
        textContent="Loading..."
      />
      {/* Online Printers */}
      <View style={styles.container}>
        <Text style={styles.title}>Online Printers</Text>
        {loadingNodePrinters ? (
          <Text>Loading printers...</Text>
        ) : onlinePrinters.length === 0 ? (
          <Text>No online printers available</Text>
        ) : (
          <FlatList
            data={onlinePrinters}
            keyExtractor={item => item.id.toString()}
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
        <Text style={styles.title}>Offline Printers</Text>
        {loadingNodePrinters ? (
          <Text>Loading printers...</Text>
        ) : offlinePrinters.length === 0 ? (
          <Text>No offline printers available</Text>
        ) : (
          <FlatList
            data={offlinePrinters}
            keyExtractor={item => item.id.toString()}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
