import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, Button, Alert} from 'react-native';
import {
  getWifiPrinters,
  getBluetoothPrinters,
} from '../../../services/serviceApi'; // Import the service
import {useSelector, useDispatch} from 'react-redux';
import {
  selectWiFiPrinter,
  deselectWiFiPrinter,
  selectNodePrinter,
  deselectNodePrinter,
} from '../../../redux/printerSlice';
import colors from '../../../../colors/colors';
import Spinner from 'react-native-loading-spinner-overlay';
import {getNodePrinters} from '../../../services/serviceApi';

const PrintersList = () => {
  const [wifiPrinters, setWifiPrinters] = useState([]);
  const [nodePrinters, setNodePrinters] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

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
        console.log('Fetched printers from API:', data); // Log the printers fetched
        setWifiPrinters(data);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPrinter = printer => {
    if (selectedWiFiPrinters.some(p => p.name === printer.name)) {
      console.log(`Deselecting printer: ${printer.name}`); // Log deselect action
      dispatch(deselectWiFiPrinter(printer));
    } else {
      console.log(`Selecting printer: ${printer.name}`); // Log select action7777
      dispatch(selectWiFiPrinter(printer));
    }
  };

  // Fetch PRINTNODE printers
  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const printersList = await getNodePrinters();
        setNodePrinters(printersList);
      } catch (error) {
        Alert.alert('Unable to fetch printers.', 'Error');
      }
    };
    fetchPrinters();
  }, []);

  // Handle PrintNode printer selection
  const handleSelectNodePrinter = printer => {
    if (selectedNodePrinter && selectedNodePrinter.name === printer.name) {
      console.log(`Deselecting PrintNode printer: ${printer.name}`);
      dispatch(deselectNodePrinter());
    } else {
      console.log(`Selecting PrintNode printer: ${printer.name}`);
      dispatch(selectNodePrinter(printer));
    }
  };

  return (
    <View>
      <Spinner visible={loading} />
      <View style={styles.container}>
        <Text style={styles.title}>Wi-Fi</Text>
        {loading ? (
          <Text>Loading printers...</Text>
        ) : wifiPrinters.length === 0 ? (
          <Text>No printers available</Text>
        ) : (
          <FlatList
            data={wifiPrinters}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.printerList}>
                <Text>{item.name || 'Unknown Printer'}</Text>
                <Button
                  title={
                    selectedWiFiPrinters.some(p => p.name === item.name)
                      ? 'Deselect'
                      : 'Select'
                  }
                  onPress={() => handleSelectPrinter(item)}
                />
              </View>
            )}
          />
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>PRINT NODE Printers</Text>
        {loading ? (
          <Text>Loading printers...</Text>
        ) : nodePrinters.length === 0 ? (
          <Text>No printers available</Text>
        ) : (
          <FlatList
            data={nodePrinters}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.printerList}>
                <Text>{item.name || 'Unknown Printer'}</Text>
                <Button
                  title={
                    selectedNodePrinter && selectedNodePrinter.id === item.id
                      ? 'Deselect'
                      : 'Select'
                  }
                  onPress={() => handleSelectNodePrinter(item)}
                />
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
    backgroundColor: colors.greyCream,
    paddingHorizontal: 15,
    paddingBottom: 15,
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
  },
});

export default PrintersList;
