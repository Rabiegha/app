import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icons from '../../assets/images/icons';
import colors from '../../assets/colors/colors';

interface EventDetailsPerTypeComponentProps {
  totalAttendees: number;
  totalCheckedIn: number;
  totalNotCheckedIn: number;
  totalAttendeesAction: () => void;
  checkedInAction: () => void;
  notCheckedOInAction: () => void;
}

interface EventDetailItem {
  backgroundColor: string;
  label: string;
  value: number;
  source: any; // Using any for image source type
  action: () => void;
}

const EventDetailsComponent = ({
  totalAttendees,
  totalCheckedIn,
  totalNotCheckedIn,
  totalAttendeesAction,
  checkedInAction,
  notCheckedOInAction,

}: EventDetailsPerTypeComponentProps) => {
  const data: EventDetailItem[] = [
    {
      backgroundColor: colors.detailsBlue,
      label: 'Total des participants',
      value: totalAttendees,
      source: Icons.totalAttendees,
      action: totalAttendeesAction,
    },
    {
      backgroundColor: colors.detailsGreen,
      label: 'Checked In',
      value: totalCheckedIn,
      source: Icons.checkedIn,
      action: checkedInAction,
    },
    {
      backgroundColor: colors.detailOrange,
      label: 'Not Checked In',
      value: totalNotCheckedIn,
      source: Icons.notAttended,
      action: notCheckedOInAction,
    },
  ];
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            style={styles.elementContainer}
            onPress={item.action}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.imageContainer,
                {backgroundColor: item.backgroundColor},
              ]}>
              <Image
                style={styles.image}
                source={item.source}
                resizeMode="contain"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  elementContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: colors.greyCream,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  imageContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  image: {
    width: 32,
    height: 32,
    tintColor: 'white',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.darkGrey,
    marginBottom: 4,
  },
  value: {
    color: colors.green,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default EventDetailsComponent;
