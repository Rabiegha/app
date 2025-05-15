import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import colors from '../../assets/colors/colors';
import Icons from '@/assets/images/icons';
import { SearchProps } from './Search.types';

const windowWidth = Dimensions.get('window').width;

/**
 * Search input component with search icon
 */
const Search: React.FC<SearchProps> = ({
  onChange,
  value,
  containerStyle,
  inputStyle,
  ...rest
}) => {
  return (
    <View style={[styles.searchBarContainer, containerStyle]}>
      <View style={styles.iconContainer}>
        <Image
          source={Icons.Rechercher}
          resizeMode="contain"
          style={{
            width: 23,
            height: 23,
            tintColor: colors.lightGrey,
          }}
        />
      </View>
      <TextInput
        style={[styles.searchInput, inputStyle]}
        placeholder="Rechercher..."
        placeholderTextColor="#999"
        onChangeText={onChange}
        value={value}
        {...rest}
      />
    </View>
  );
};

/**
 * Styles for the Search component
 */
const styles = StyleSheet.create<{
  searchBarContainer: ViewStyle;
  iconContainer: ViewStyle;
  searchInput: TextStyle;
}>({
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
