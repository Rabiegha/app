import React from 'react';
import {View, TextInput, StyleSheet, Dimensions, Image} from 'react-native';
import colors from '../../../colors/colors';
import RechercherIcon from '../../assets/images/icons/Rechercher.png';

const windowWidth = Dimensions.get('window').width;

const Search = ({ onChange, value }) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.iconContainer}>
        <Image
          source={RechercherIcon}
          resizeMode="contain"
          style={{
            width: 23,
            height: 23,
            tintColor: colors.lightGrey,
          }}
        />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher..."
        placeholderTextColor="#999"
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '100%',
    height: 50,
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.greyCream,
    marginTop: -35,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    color: colors.darkGrey,
  },
  iconContainer: {
    marginRight: 10,
  },
});

export default Search;
