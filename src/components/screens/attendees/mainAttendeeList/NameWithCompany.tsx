import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../../../assets/colors/colors';
import HighlightText from './HighlightText';

interface NameWithCompanyProps {
  firstName: string;
  lastName: string;
  organization?: string;
  searchQuery: string;
  isSearchByCompanyMode: boolean;
}

/**
 * Render the attendee's name and (optionally) their company in separate Text elements,
 * so they can be styled differently.
 */
const NameWithCompany: React.FC<NameWithCompanyProps> = ({
  firstName,
  lastName,
  organization,
  searchQuery,
  isSearchByCompanyMode,
}) => {
  const fullName = `${firstName} ${lastName}`;
  
  // Decide if we should show company
  const shouldShowCompany =
    isSearchByCompanyMode && organization && searchQuery.trim() !== '';

  if (shouldShowCompany) {
    return (
      <View style={styles.nameRow}>
        {/* Name */}
        <Text style={styles.nameText}>
          <HighlightText text={fullName} query={searchQuery} />
        </Text>

        {/* Company in parentheses, with a different style */}
        <Text style={styles.companyParen}> (</Text>
        <Text style={styles.companyText}>
          <HighlightText text={organization} query={searchQuery} />
        </Text>
        <Text style={styles.companyParen}>)</Text>
      </View>
    );
  }
  
  // If not showing the company, just render the name
  return (
    <View style={styles.nameRow}>
      <Text style={styles.nameText}>
        <HighlightText text={fullName} query={searchQuery} />
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // keeps text aligned nicely
  },
  // Base text style for the attendee's name
  nameText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  // Parentheses around company
  companyParen: {
    fontSize: 12,
    color: colors.grey,
    fontStyle: 'italic',
  },
  // Text style specifically for the company name
  companyText: {
    fontSize: 12,
    color: colors.grey,
    fontStyle: 'italic',
  },
});

export default NameWithCompany;
