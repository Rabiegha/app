import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import colors from '../../../assets/colors/colors';
import { useEvent } from '../../../context/EventContext';
import Icons from '../../../assets/images/icons';
import { BaseAttendeeListItemProps } from './types/attendeeList.types';
import { renderNameWithOptionalCompany } from './utils/highlightUtils';

const { width } = Dimensions.get('window');

const BaseAttendeeListItem: React.FC<BaseAttendeeListItemProps> = ({
  item,
  searchQuery = '',
  onUpdateAttendee,
  onSwipeableOpen,
}) => {
  const navigation = useNavigation();
  const { triggerListRefresh } = useEvent();
  const swipeableRef = useRef(null);
  const isSwipeOpen = useRef(false);

  // Redux: whether to show the company name in search
  const isSearchByCompanyMode = true;

  // Local "checked in" state
  const initialSwitchState = item.attendee_status === 1;
  const [isCheckedIn, setIsCheckedIn] = useState(initialSwitchState);

  // Toggle attendee_status
  const handleSwitchToggle = async () => {
    if (!onUpdateAttendee) return;
    
    try {
      const newAttendeeStatus = item.attendee_status === 1 ? 0 : 1;
      setIsCheckedIn(newAttendeeStatus === 1);
      const updatedAttendee = {
        ...item,
        attendee_status: newAttendeeStatus,
      };
      await onUpdateAttendee(updatedAttendee);
      triggerListRefresh?.();
    } catch (error) {
      console.error('Error updating attendee status:', error);
    }
  };

  // Print & Check-In
  const handlePrintAndCheckIn = async () => {
    if (!onUpdateAttendee) return;
    
    try {
      const updatedAttendee = {
        ...item,
        attendee_status: 1,
      };
      setIsCheckedIn(true);
      await onUpdateAttendee(updatedAttendee);
      // Note: Specific print functionality should be implemented in child components
    } catch (error) {
      console.error('Error while printing and checking in:', error);
    }
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

  // Swipe actions (Print + Check)
  const renderRightActions = useCallback(
    (progress, dragX) => {
      const action1TranslateX = dragX.interpolate({
        inputRange: [-145, -80, 0],
        outputRange: [0, 50, 100],
        extrapolate: 'clamp',
      });

      const action2TranslateX = dragX.interpolate({
        inputRange: [-145, -80, 0],
        outputRange: [0, 0, 50],
        extrapolate: 'clamp',
      });

      return (
        <View style={styles.actionsContainer}>
          <Animated.View
            style={[
              styles.rightAction,
              { transform: [{ translateX: action1TranslateX }] },
            ]}>
            <TouchableOpacity
              onPress={handlePrintAndCheckIn}
              style={[
                styles.rightActionButton,
                { backgroundColor: colors.darkGrey, zIndex: 10 },
              ]}>
              <Text style={styles.actionText}>Print</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.rightAction,
              { transform: [{ translateX: action2TranslateX }] },
            ]}>
            <TouchableOpacity
              onPress={handleSwitchToggle}
              style={[
                styles.rightActionButton,
                { backgroundColor: isCheckedIn ? colors.red : colors.green },
              ]}>
              <Text style={[styles.actionText, { zIndex: 5 }]}>
                {isCheckedIn ? 'Uncheck' : 'Check'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    },
    [isCheckedIn, onUpdateAttendee]
  );

  const handleSwipeableOpen = () => {
    if (onSwipeableOpen && swipeableRef.current) {
      onSwipeableOpen(swipeableRef);
    }
    isSwipeOpen.current = true;
  };

  const handleSwipeableClose = () => {
    isSwipeOpen.current = false;
  };

  // Determine if we should show type mode indicators
  const isTypeModeActive = true;

  const renderContent = () => {
    return (
      <TouchableWithoutFeedback onPress={handleItemPress} accessible={false}>
        <View style={styles.listItemContainer}>
          {/* Main Content */}
          <View style={styles.contentContainer}>
            {renderNameWithOptionalCompany(
              item.first_name,
              item.last_name,
              item.organization,
              searchQuery,
              isSearchByCompanyMode
            )}
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
                { backgroundColor: item.attendee_type_background_color || colors.grey }
              ]}>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  // If we have swipeable functionality
  if (onUpdateAttendee && onSwipeableOpen) {
    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleSwipeableOpen}
        onSwipeableClose={handleSwipeableClose}
        rightThreshold={40}>
        {renderContent()}
      </Swipeable>
    );
  }

  // Otherwise just render the content
  return renderContent();
};

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
  actionsContainer: {
    width: 160,
    flexDirection: 'row',
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  rightActionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: 70,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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

export default BaseAttendeeListItem;
