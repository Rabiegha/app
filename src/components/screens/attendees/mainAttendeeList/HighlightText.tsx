import React from 'react';
import { Text } from 'react-native';
import colors from '../../../../assets/colors/colors';
import { StyleSheet } from 'react-native';

interface HighlightTextProps {
  text: string;
  query: string;
}

/**
 * Highlights search matches in green + bold.
 * If `searchQuery` is empty, just return the original text.
 * Otherwise, split out the matched parts and wrap them in <Text> with a highlight style.
 */
const HighlightText: React.FC<HighlightTextProps> = ({ text, query }) => {
  // If no query, just return text as a single array item
  const safeQuery = (query || '').trim();
  if (!safeQuery) {
    return <Text>{text}</Text>;
  }

  // Build regex for the query
  const regex = new RegExp(`(${safeQuery})`, 'gi');
  // Split the text by the matched portions
  const parts = text.split(regex);

  // Map each part to either a highlighted <Text> or a normal <Text>
  return (
    <>
      {parts.filter(Boolean).map((part, index) => {
        const isMatch = regex.test(part);
        if (isMatch) {
          return (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </>
  );
};

const styles = StyleSheet.create({
  // Style for highlighted portions of the text
  highlight: {
    color: colors.green,
    fontWeight: 'bold',
  },
});

export default HighlightText;
