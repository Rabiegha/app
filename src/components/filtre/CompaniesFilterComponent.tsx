// CompaniesFilterComponent.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../assets/colors/colors';
import useEventOrganizations from '../../hooks/useEventOrganizations';
import RedBorderButton from '../elements/buttons/RedBorderButton';
import { CompaniesFilterComponentProps, Organization } from './CompaniesFilterComponent.types';

/**
 * Component for filtering attendees by company/organization
 */
const CompaniesFilterComponent: React.FC<CompaniesFilterComponentProps> = ({ 
  filterCriteria, 
  setFilterCriteria,
  style 
}) => {

  // Our custom hook now returns { organizations, loading, error, refetch }
  const { organizations, loading, error, refetch } = useEventOrganizations();

  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1) While loading
  if (loading) {
    return <ActivityIndicator style={{ margin: 16 }} />;
  }

  // 2) If error, show a Retry button
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Oops, there was a problem fetching the companies:
          {'\n'}
          {error?.message || error?.toString?.()}
        </Text>

        {/* Retry button */}
        <RedBorderButton
          Titre="Retry"
          color={colors.red}
          onPress={refetch} 
          style={undefined}        />
      </View>
    );
  }

  // 3) If no error, proceed with data
  // Convert organizations to string array of names
  const augmentedCompanies: string[] = ['None', ...organizations.map(org => typeof org === 'object' && org !== null ? org.name : String(org))];
  const filteredOrganizations: string[] = augmentedCompanies.filter((companyName: string) =>
    companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // On press
  const handleCompanyPress = (companyName: string): void => {
    if (companyName === 'None') {
      setFilterCriteria(prev => ({
        ...prev,
        company: null,
      }));
    } else {
      setFilterCriteria(prev => ({
        ...prev,
        company: companyName,
      }));
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Companies</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search companies..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredOrganizations.length === 0 ? (
        <Text style={styles.infoText}>No companies match your search.</Text>
      ) : (
        <FlatList
          nestedScrollEnabled
          style={{ maxHeight: 200 }}
          data={filteredOrganizations}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item: companyName }) => {
            const isNoneSelected = filterCriteria.company == null;
            const selected = companyName === 'None'
              ? isNoneSelected
              : filterCriteria.company === companyName;

            return (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleCompanyPress(companyName)}
              >
                <View style={[styles.checkbox, selected && styles.checked]} />
                <Text style={styles.optionText}>{companyName}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default CompaniesFilterComponent;

/**
 * Styles for the CompaniesFilterComponent
 */
const styles = StyleSheet.create<{
  container: ViewStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  title: TextStyle;
  infoText: TextStyle;
  searchInput: TextStyle;
  option: ViewStyle;
  checkbox: ViewStyle;
  checked: ViewStyle;
  optionText: TextStyle;
}>({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  // Error area
  errorContainer: {
    margin: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.greyCream,
  },
  infoText: {
    color: colors.greyCream,
    fontSize: 14,
    marginTop: 10,
  },
  searchInput: {
    height: 40,
    borderColor: colors.greyCream,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: colors.greyCream,
    marginVertical: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.greyCream,
    marginRight: 10,
  },
  checked: {
    backgroundColor: colors.greyCream,
  },
  optionText: {
    color: colors.greyCream,
    fontSize: 12,
  },
});
