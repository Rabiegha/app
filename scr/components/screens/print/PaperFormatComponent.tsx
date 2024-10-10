import {React, useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {selectPaperFormat, setOption} from '../../../redux/printerSlice';
import colors from '../../../../colors/colors';

export const PaperFormatComponent = () => {
  const dispatch = useDispatch();

  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );
  /*   const selectedPaperFormat = useSelector(
    state => state.printers.selectedPaperFormat,
  ); */

  const selectedOptions = useSelector(state => state.printers.selectedOptions);

  const selectedPaperFormat = selectedOptions.paperFormat;
  if (!selectedNodePrinter) {
    return <Text>Veuillez d'abord sélectionner une imprimante.</Text>;
  }

  // Récupérer les formats de papier de l'imprimante sélectionnée
  const paperFormats = Object.keys(selectedNodePrinter.capabilities.papers);

  if (paperFormats.length === 0) {
    return (
      <Text>Aucun format de papier disponible pour cette imprimante.</Text>
    );
  }

  // Définir un format de papier par défaut si aucun n'est sélectionné
  useEffect(() => {
    if (!selectedPaperFormat && paperFormats.length > 0) {
      dispatch(setOption({optionName: 'paperFormat', value: paperFormats[0]}));
    }
  }, [selectedPaperFormat, paperFormats]);

  // handleFormatChange
  const handleFormatChange = itemValue => {
    dispatch(setOption({optionName: 'paperFormat', value: itemValue}));
  };

  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handleFormatChange(item)}>
      <View
        style={[
          styles.itemContainer,
          selectedPaperFormat === item && styles.selectedItem,
        ]}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sélectionnez le format de papier :</Text>
      <FlatList
        data={paperFormats}
        keyExtractor={item => item}
        renderItem={renderItem}
        extraData={selectedPaperFormat}
      />
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
    paddingTop: 15,
  },
  title: {
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedItem: {
    backgroundColor: '#d0e0fc',
  },
  itemText: {
    fontSize: 16,
  },
});
