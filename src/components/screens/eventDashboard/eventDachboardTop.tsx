import { StyleSheet, Text, View, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import React from 'react';
import colors from '../../../assets/colors/colors';
import EventImage from '../../../assets/images/user.png';
import { EventDachboardTopComponentProps } from './eventDachboardTop.types';

/**
 * Component for displaying event information at the top of the dashboard
 */
const EventDachboardTopComponent: React.FC<EventDachboardTopComponentProps> = ({
  eventImage,
  eventName,
  eventDetails,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageContainer}>
        <Image source={
                eventImage
                ? {uri: eventImage} 
                : EventImage} style={styles.image} />
      </View>
      <Text style={styles.title}>{eventName}</Text>
      <Text style={styles.text}>{eventDetails}</Text>
    </View>
  );
};

/**
 * Styles for the EventDachboardTopComponent
 */
const styles = StyleSheet.create<{
  container: ViewStyle;
  imageContainer: ViewStyle;
  image: ImageStyle;
  title: TextStyle;
  text: TextStyle;
}>({
  container: {
    marginHorizontal: 30,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
    color: colors.darkGrey,
    marginBottom: 5,
  },
  text: {
    color: colors.green,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    height: 140,
    width: 140,
    borderRadius: 70,
  },
});

export default EventDachboardTopComponent;
