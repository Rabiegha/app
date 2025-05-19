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
import Icons from '../../../assets/images/icons';
import ErrorView from '../../elements/view/ErrorView';
import Search from '../../elements/Search';

interface Printer {
  id: string;
  name: string;
  state: 'online' | 'offline';
  description?: string;
}

interface PrintersListProps {
  refreshCallback?: (refreshFunction: () => void) => void;
}

const PrintersList = ({ refreshCallback }: PrintersListProps) => {
  const [wifiPrinters, setWifiPrinters] = useState<Printer[]>([]);
  const [nodePrinters, setNodePrinters] = useState<Printer[]>([]);
  const dispatch = useDispatch();
  const [loadingWifiPrinters, setLoadingWifiPrinters] = useState(true);
  const [loadingNodePrinters, setLoadingNodePrinters] = useState(true);
  const [loadingPrinter, setLoadingPrinter] = useState(false);
  const [refreshing, setRefreshing] = useState(false); 
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const selectedNodePrinter = useSelector(
    (state: any) => state.printers.selectedNodePrinter,
  );


  const fetchPrinters = useCallback(async (withSpinner: boolean) => {
    if (withSpinner) setLoadingNodePrinters(true);
    setError(false);
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoadingNodePrinters(false);
      setRefreshing(false);
      setError(true);
      Alert.alert(
        'Timeout', 
        'La récupération des imprimantes a pris trop de temps. Veuillez réessayer.',
        [
          {text: 'OK'},
          {text: 'Réessayer', onPress: () => fetchPrinters(true)}
        ]
      );
    }, 8000); // 8 second timeout

    try {
      const printersList = await getNodePrinters();
      clearTimeout(timeout);
      setNodePrinters(printersList);
    } catch (err) {
      clearTimeout(timeout);
      setError(true);
      Alert.alert(
        'Erreur', 
        'Impossible de récupérer les imprimantes.',
        [
          {text: 'OK'},
          {text: 'Réessayer', onPress: () => fetchPrinters(true)}
        ]
      );
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
  
  // Expose the refresh function to parent component if provided
  useEffect(() => {
    if (refreshCallback) {
      refreshCallback(triggerRefresh);
    }
  }, [refreshCallback]);

  // Filter printers based on search query and state
  const filteredPrinters = nodePrinters.filter(printer => {
    const matchesSearch = printer.name.toLowerCase().includes(searchQuery.toLowerCase());
    return printer.state === 'offline' && matchesSearch;
  });
  
  // Keep the original filters for reference
  const onlinePrinters = nodePrinters.filter(
    printer => printer.state === 'online',
  );
  const offlinePrinters = nodePrinters.filter(
    printer => printer.state === 'offline',
  );

  const handleSelectNodePrinter = async (printer: Printer) => {
    setLoadingPrinter(true);
    
    // Set a timeout to prevent infinite loading
    const selectionTimeout = setTimeout(() => {
      setLoadingPrinter(false);
      Alert.alert(
        'Timeout', 
        'La sélection de l\'imprimante a pris trop de temps. Veuillez réessayer.',
        [{text: 'OK'}]
      );
    }, 8000); // 5 second timeout
    
    try {
      if (selectedNodePrinter && selectedNodePrinter.name === printer.name) {
        await dispatch(deselectNodePrinterAsync()).unwrap();
      } else {
        await dispatch(selectNodePrinterAsync(printer)).unwrap();
      }
      clearTimeout(selectionTimeout);
    } catch (error) {
      clearTimeout(selectionTimeout);
      Alert.alert(
        'Erreur', 
        'La sélection de l\'imprimante a échoué. Veuillez réessayer.',
        [{text: 'OK'}]
      );
    } finally {
      setLoadingPrinter(false);
    }
  };

  useEffect(() => {
  if (selectedNodePrinter) {
    console.log('[PrintersList] nouveau printer sélectionné :', selectedNodePrinter.name);
  }
}, [selectedNodePrinter]);

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <ErrorView handleRetry={() => fetchPrinters(true)} />
      </View>
    );
  }
  
  // Function to highlight matching text in printer names
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <Text>{text}</Text>;
    }
    
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <Text>
        {parts.map((part, i) => {
          const isHighlighted = part.toLowerCase() === highlight.toLowerCase();
          return (
            <Text
              key={i}
              style={{
                backgroundColor: isHighlighted ? colors.detailsGreen + '40' : undefined,
                fontWeight: isHighlighted ? '700' : '400',
                color: isHighlighted ? colors.green : undefined,
              }}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Spinner
        visible={loadingNodePrinters || loadingPrinter}
        textContent="Loading..."
      />
      
      {/* Reload functionality moved to header */}
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search 
          value={searchQuery}
          onChange={setSearchQuery}
        />
      </View>

      {/* Online Printers */}
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <View style={styles.onlineIndicator} />
          <Text style={styles.title}>Online Printers</Text>
        </View>
        {loadingNodePrinters ? (
          <Text style={styles.status}>Loading printers...</Text>
        ) : filteredPrinters.length > 0 ? (
          <FlatList
            data={filteredPrinters}
            keyExtractor={item => item.id.toString()}
            refreshing={refreshing} 
            onRefresh={triggerRefresh}
            contentContainerStyle={styles.printersListContent}
            style={styles.printersList}
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
                <View>
                  <Text style={[
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
                    {highlightText(item.name || 'Unknown Printer', searchQuery)}
                  </Text>
                </View>
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
        ) : searchQuery ? (
          <Text style={styles.emptyMessage}>No printers matching "{searchQuery}"</Text>
        ) : (
          <Text style={styles.emptyMessage}>No printers available</Text>
        )}
      </View>
      
      {/* We keep the offlinePrinters data for testing but don't display it */}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingVertical: 10,
    marginTop: 35, // Compensate for the negative margin in the Search component
  },
  container: {
    flex: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  printersList: {
    flex: 1,
  },
  printersListContent: {
    paddingBottom: 100, // Add space at the bottom of the list
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
