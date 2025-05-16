import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../../../../assets/colors/colors';

/**
 * Highlights search matches in green + bold.
 * If `searchQuery` is empty, just returns the original text.
 * Otherwise, splits out the matched parts and wraps them in <Text> with a highlight style.
 */
export const highlightSearch = (text: string, query: string) => {
  // If no query, just return text as a single array item
  const safeQuery = (query || '').trim();
  if (!safeQuery) {
    return [text];
  }

  // Build regex for the query
  const regex = new RegExp(`(${safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  // Split the text by the matched portions
  const parts = text.split(regex);

  // Map each part to either a highlighted <Text> or a normal <Text>
  return parts.filter(Boolean).map((part, index) => {
    const isMatch = regex.test(part);
    if (isMatch) {
      return (
        <Text key={index} style={styles.highlight}>
          {part}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

/**
 * Renders the attendee's name and (optionally) their company in separate Text elements,
 * so they can be styled differently.
 */
export const renderNameWithOptionalCompany = (
  firstName: string,
  lastName: string,
  organization: string | undefined,
  searchQuery: string,
  isSearchByCompanyMode: boolean
) => {
  // Build up the highlighted name
  const nameHighlighted = highlightSearch(
    `${firstName} ${lastName}`,
    searchQuery
  );

  // Decide if we should show company, highlight it if we do
  const shouldShowCompany =
    isSearchByCompanyMode && organization && searchQuery.trim() !== '';
  
  if (shouldShowCompany) {
    const companyHighlighted = highlightSearch(
      organization,
      searchQuery
    );

    return (
      <View style={styles.nameRow}>
        {/* Name */}
        <Text style={styles.nameText}>{nameHighlighted}</Text>

        {/* Company in parentheses, with a different style */}
        <Text style={styles.companyParen}> (</Text>
        <Text style={styles.companyText}>{companyHighlighted}</Text>
        <Text style={styles.companyParen}>)</Text>
      </View>
    );
  } else {
    // If not showing the company, just render the name
    return (
      <View style={styles.nameRow}>
        <Text style={styles.nameText}>{nameHighlighted}</Text>
      </View>
    );
  }
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
  // Style for highlighted portions of the text
  highlight: {
    color: colors.green,
    fontWeight: 'bold',
  },
});
