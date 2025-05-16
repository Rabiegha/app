// components/ListCard.ts
import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import colors from '../../assets/colors/colors';
import HighlightText from './HighlightText';
import { SessionStatus } from '../../utils/date/sessionDateUtils';

interface ListCardProps {
  title: string;
  subtitle1?: string;
  subtitle2?: string;
  searchQuery?: string;
  sessionStatus?: SessionStatus;
  onPress: () => void;
}

const ListCard = ({ title, subtitle1, subtitle2, searchQuery = '', sessionStatus, onPress }: ListCardProps) => {
  // Obtenir le style du tag en fonction du statut
  const getStatusTagStyle = () => {
    if (!sessionStatus) return null;
    
    switch (sessionStatus) {
      case SessionStatus.UPCOMING:
        return styles.upcomingTag;
      case SessionStatus.FUTURE:
        return styles.futureTag;
      case SessionStatus.PAST:
        return styles.pastTag;
      default:
        return null;
    }
  };
  
  // Obtenir le texte du tag
  const getStatusText = () => {
    if (!sessionStatus) return '';
    
    switch (sessionStatus) {
      case SessionStatus.UPCOMING:
        return 'À venir';
      case SessionStatus.FUTURE:
        return 'Programmée';
      case SessionStatus.PAST:
        return 'Passée';
      default:
        return '';
    }
  };
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <HighlightText 
          text={title}
          searchWords={searchQuery}
          style={styles.title}
          highlightStyle={styles.highlight}
        />
        {sessionStatus && (
          <View style={[styles.statusTag, getStatusTagStyle()]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        )}
      </View>
      {subtitle1 && (
        <HighlightText 
          text={subtitle1}
          searchWords={searchQuery}
          style={styles.subtitle}
          highlightStyle={styles.highlight}
        />
      )}
      {subtitle2 && (
        <HighlightText 
          text={subtitle2}
          searchWords={searchQuery}
          style={styles.subtitle}
          highlightStyle={styles.highlight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.greyCream,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.darkGrey,
    flex: 1,
    paddingRight: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.darkGrey,
  },
  highlight: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    color: colors.green,
    fontWeight: 'bold',
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  upcomingTag: {
    backgroundColor: '#FF9500', // Orange
  },
  futureTag: {
    backgroundColor: '#007AFF', // Bleu
  },
  pastTag: {
    backgroundColor: '#8E8E93', // Gris
  },
});

export default ListCard;
