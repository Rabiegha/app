// components/ListCard.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import colors from '../../assets/colors/colors';
import { ListCardProps } from './ListCard.types';

/**
 * Card component for displaying items in a list
 */
const ListCard: React.FC<ListCardProps> = ({ title, subtitle1, subtitle2, onPress, style }) => (
  <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    {subtitle1 && <Text style={styles.subtitle}>{subtitle1}</Text>}
    {subtitle2 && <Text style={styles.subtitle}>{subtitle2}</Text>}
  </TouchableOpacity>
);

/**
 * Styles for the ListCard component
 */
const styles = StyleSheet.create<{
  card: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
}>({
  card: {
    backgroundColor: colors.greyCream,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '900',
    color: colors.darkGrey,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.darkGrey,
  },
});

export default ListCard;
