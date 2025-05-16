import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../../assets/colors/colors';
import { Session } from '../../../types/session';
import HighlightText from '../../elements/HighlightText';

interface HighlightedSessionItemProps {
  session: Session;
  searchQuery: string;
  onPress: (session: Session) => void;
}

const HighlightedSessionItem = ({
  session,
  searchQuery,
  onPress,
}: HighlightedSessionItemProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(session)}
    >
      <View style={styles.contentContainer}>
        <HighlightText 
          text={session.event_name}
          searchWords={searchQuery}
          style={styles.title}
          highlightStyle={styles.highlight}
        />
        <View style={styles.detailsRow}>
          <HighlightText
            text={session.nice_start_datetime}
            searchWords={searchQuery}
            style={styles.subtitle}
            highlightStyle={styles.highlight}
          />
          <HighlightText
            text={`Location: ${session.location || 'N/A'}`}
            searchWords={searchQuery}
            style={styles.subtitle}
            highlightStyle={styles.highlight}
          />
        </View>
        <Text style={styles.capacity}>
          Capacity: {session.capacity}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkGrey,
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.darkGrey,
  },
  capacity: {
    fontSize: 14,
    color: colors.lightGrey,
  },
  highlight: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: colors.green,
    fontWeight: 'bold',
  },
});

export default HighlightedSessionItem;
