// components/ListCard.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../assets/colors/colors';

const ListCard = ({ title, subtitle1, subtitle2, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
    {subtitle1 && <Text style={styles.subtitle}>{subtitle1}</Text>}
    {subtitle2 && <Text style={styles.subtitle}>{subtitle2}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
    fontWeight: '300',
  },
});

export default ListCard;
