import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import colors from '../../assets/colors/colors';

interface HighlightTextProps {
  text: string;
  searchWords: string;
  style?: TextStyle;
  highlightStyle?: TextStyle;
}

/**
 * Component to highlight search terms within text
 */
const HighlightText = ({ 
  text, 
  searchWords, 
  style = {}, 
  highlightStyle = styles.highlight 
}: HighlightTextProps) => {
  
  if (!text) return null;
  if (!searchWords || searchWords.trim() === '') {
    return <Text style={style}>{text}</Text>;
  }

  // Escape special regex characters and create a safe pattern
  const safeSearchWords = searchWords.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create a case-insensitive regex pattern
  const regex = new RegExp(`(${safeSearchWords})`, 'gi');
  
  // Split the text into parts
  const parts = text.split(regex);
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        // Check if this part matches the search term
        const isMatch = regex.test(part);
        regex.lastIndex = 0; // Reset regex index for next test
        
        return isMatch ? (
          <Text key={index} style={highlightStyle}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  highlight: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: colors.green,
    fontWeight: 'bold',
  },
});

export default HighlightText;
