import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
} from 'react-native';
import colors from '../../assets/colors/colors';

import useEventOrganizations from '../../hooks/useEventOrganizations';
import { useSelector } from 'react-redux';
import { selectCurrentUserId } from '../../redux/selectors/auth/authSelectors';
import { useEvent } from '../../context/EventContext';

const CompaniesFilterComponent = ({ filterCriteria, setFilterCriteria }) => {
  // 1. Get userId & eventId
  const userId = useSelector(selectCurrentUserId);
  const { eventId } = useEvent();

  // 2. Fetch companies with your custom hook
  const { organizations, loading, error } = useEventOrganizations(userId, eventId);

  // 3. Local state for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Filter the organizations by search query
  const filteredOrganizations = organizations.filter((companyName) =>
    companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 5. Handle selecting a company
  const handleCompanyPress = (companyName) => {
    setFilterCriteria((prev) => ({
      ...prev,
      company: companyName,
    }));
  };

  // 6. Handle loading / error states
  if (loading) {
    return <ActivityIndicator style={{ margin: 16 }} />;
  }

  if (error) {
    return (
      <Text style={[styles.infoText, { color: 'red' }]}>
        Error: {error.message || error.toString()}
      </Text>
    );
  }

  // 7. Render the UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Companies</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search companies..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* FlatList for the scrollable list */}
      {filteredOrganizations.length === 0 ? (
        <Text style={styles.infoText}>No companies match your search.</Text>
      ) : (
        <FlatList
          data={filteredOrganizations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: companyName }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleCompanyPress(companyName)}
            >
              <View
                style={[
                  styles.checkbox,
                  filterCriteria.company === companyName && styles.checked,
                ]}
              />
              <Text style={styles.optionText}>{companyName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CompaniesFilterComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: 200,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.greyCream,
    marginBottom: 10,
  },
  infoText: {
    color: colors.greyCream,
    fontSize: 14,
  },
  // Search bar styling
  searchInput: {
    height: 40,
    borderColor: colors.greyCream,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: colors.greyCream,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
