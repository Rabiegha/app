import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../../assets/colors/colors';
import Icons from '../../../../assets/images/icons';
import { Attendee } from '../../../../types/attendee.types';
import NameWithCompany from './NameWithCompany';
import SwipeableAttendeeItem from './SwipeableAttendeeItem';

// Global flag for type mode - consider moving this to a context or Redux store
let isTypeModeActive = true;

interface ListItemProps {
  item: Attendee;
  searchQuery?: string;
  isCheckedIn: boolean;
  isSearchByCompanyMode: boolean;
  onUpdateAttendee: (attendee: Attendee) => Promise<void>;
  onSwipeableOpen?: (ref: React.RefObject<any>) => void;
  onPrintAndCheckIn: (attendee: Attendee) => Promise<void>;
  onToggleCheckIn: (attendee: Attendee) => Promise<void>;
}

const ListItem = React.memo(
  ({ 
    item, 
    searchQuery = '', 
    isCheckedIn,
    isSearchByCompanyMode,
    onUpdateAttendee, 
    onSwipeableOpen,
    onPrintAndCheckIn,
    onToggleCheckIn
  }: ListItemProps) => {
    const navigation = useNavigation();

    // Simplified handlers that delegate to parent components
    const handleSwitchToggle = () => {
      onToggleCheckIn(item);
    };

    const handlePrintAndCheckIn = () => {
      onPrintAndCheckIn(item);
    };

    // Navigate to "More" screen on item press
    const handleItemPress = () => {
      navigation.navigate('More', {
        attendeeId: item.id,
        eventId: item.event_id,
        firstName: item.first_name,
        lastName: item.last_name,
        email: item.email,
        phone: item.phone,
        attendeeStatus: item.attendee_status,
        jobTitle: item.designation,
        organization: item.organization,
        type: item.attendee_type_name,
        typeId: item.attendee_type_id,
        badgePdfUrl: item.badge_pdf_url,
        badgeImageUrl: item.badge_image_url,
        attendeeTypeBackgroundColor: item.attendee_type_background_color,
        attendeeStatusChangeDatetime: item.attendee_status_change_datetime,
      });
    };





    return (
      <SwipeableAttendeeItem
        isCheckedIn={isCheckedIn}
        onSwipeableOpen={onSwipeableOpen}
        onPrintAndCheckIn={handlePrintAndCheckIn}
        onToggleCheckIn={handleSwitchToggle}
      >
        <TouchableWithoutFeedback onPress={handleItemPress} accessible={false}>
          <View style={styles.listItemContainer}>
            {/* Main Content */}
            <View style={styles.contentContainer}>
              <NameWithCompany
                firstName={item.first_name}
                lastName={item.last_name}
                organization={item.organization}
                searchQuery={searchQuery}
                isSearchByCompanyMode={isSearchByCompanyMode}
              />
            </View>

            {/* Check icon */}
            {isCheckedIn && !isTypeModeActive ? (
              <Image
                source={Icons.Accepted}
                resizeMode="contain"
                style={styles.checkedIcon}
              />
            ) : (
              <View style={styles.emptyIconSpace} />
            )}
            
            {/* Colored Indicator */}
            {isTypeModeActive && (
              <View
                style={[
                  styles.attendeeTypeIndicator,
                  {backgroundColor: item.attendee_type_background_color || colors.grey}
                ]}>
                {/* Check icon */}
                {isCheckedIn ? (
                  <Image
                    source={Icons.Accepted}
                    resizeMode="contain"
                    style={styles.checkedIconInsideIndicator}
                  />
                ) : (
                  <View style={styles.emptyIconSpace} />
                )}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </SwipeableAttendeeItem>
    );
  }
);

export default ListItem;

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    marginBottom: 10,
    height: 70,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,  // Ensures the rest of the content fits properly
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  checkedIcon: {
    width: 20,
    height: 20,
    margin: 20,
  },
  emptyIconSpace: {
    width: 20,
    height: 20,
  },
  attendeeTypeIndicator: {
    width: 50,
    height: '150%',
    marginLeft: 10,
    marginRight: -8,
    transform: [{ rotate: '20deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedIconInsideIndicator: {
    width: 15,
    height: 15,
    tintColor: 'white',
  }
});
