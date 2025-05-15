import React, {useEffect, useState, useRef, useCallback} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../assets/colors/colors';
import {useEvent} from '../../../../context/EventContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Accepted from '../../../../assets/images/icons/Accepted.png';
import {useSelector, useDispatch} from 'react-redux';
import usePrintDocument from '../../../../hooks/print/usePrintDocument';
import { ListItemProps } from '../../../../types/listItem.types';
import useFetchAttendeeDetails from '../../../../hooks/attendee/useAttendeeDetails';
import {usePrintStatus} from '../../../../printing/context/PrintStatusContext';
import { useStore } from 'react-redux';

const {width} = Dimensions.get('window');
let openSwipeableRef = null;
let isTypeModeActive = true;


const ListItem = React.memo(
  ({ item,  searchQuery = '', onUpdateAttendee, onSwipeableOpen }: ListItemProps) => {
    const navigation = useNavigation();
    const {triggerListRefresh} = useEvent();
    const swipeableRef = useRef(null);
    const dispatch = useDispatch();
    const isSwipeOpen = useRef(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

      const selectedNodePrinter = useSelector((state: any) => state.printers.selectedNodePrinter);
      const nodePrinterId = selectedNodePrinter?.id;
      const { setStatus } = usePrintStatus();

    // Redux: whether to show the company name in search
    const isSearchByCompanyMode = true;

    // Local "checked in" state
    const initialSwitchState = item.attendee_status == 1;
    const [isCheckedIn, setIsCheckedIn] = useState(initialSwitchState);

      const { attendeeDetails } =
      useFetchAttendeeDetails(refreshTrigger, item.id);

    // Toggle attendee_status
    const handleSwitchToggle = async () => {
      try {
        const newAttendeeStatus = item.attendee_status == 1 ? 0 : 1;
        setIsCheckedIn(newAttendeeStatus == 1);
        const updatedAttendee = {
          ...item,
          attendee_status: newAttendeeStatus,
        };
        await onUpdateAttendee(updatedAttendee);
      } catch (error) {
        console.error('Error updating attendee status:', error);
      }
    };


    // Print & Check-In
    const {printDocument} = usePrintDocument();
    const handlePrintAndCheckIn = async () => {
      try {
        const updatedAttendee = {
          ...item,
          attendee_status: 1,
        };
        setIsCheckedIn(true);
        await onUpdateAttendee(updatedAttendee);
        setStatus('checkin_success');
        await new Promise(resolve => setTimeout(resolve, 1000));
        printDocument(item.badge_pdf_url, nodePrinterId);
        console.log('print sent to', selectedNodePrinter?.name);
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

    /**
     * Highlights search matches in green + bold.
     * If `searchQuery` is empty, just return the original text.
     * Otherwise, split out the matched parts and wrap them in <Text> with a highlight style.
     */
    const highlightSearch = (text, query) => {
      // If no query, just return text as a single array item
      const safeQuery = (query || '').trim();
      if (!safeQuery) {
        return [text];
      }

      // Build regex for the query
      const regex = new RegExp(`(${safeQuery})`, 'gi');
      // Split the text by the matched portions
      const parts = text.split(regex);

      // Map each part to either a highlighted <Text> or a normal <Text>
      return parts.filter(Boolean).map((part, index) => {
        const isMatch = regex.test(part);
        if (isMatch) {
          return (
            <Text key={index} style={styles.highlight}>
              {part}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      });
    };

    /**
     * Render the attendee's name and (optionally) their company in *separate* Text elements,
     * so you can style them differently.
     */
    const renderNameWithOptionalCompany = () => {
      // Build up the highlighted name
      const nameHighlighted = highlightSearch(
        `${item.first_name} ${item.last_name}`,
        searchQuery
      );

      // Decide if we should show company, highlight it if we do
      const shouldShowCompany =
        isSearchByCompanyMode && item.organization && searchQuery.trim() !== '';
      if (shouldShowCompany) {
        const companyHighlighted = highlightSearch(
          item.organization,
          searchQuery
        );

        return (
          <View style={styles.nameRow}>
            {/* Name */}
            <Text style={styles.nameText}>{nameHighlighted}</Text>

            {/* Company in parentheses, with a different style */}
            <Text style={[styles.companyParen ]}> (</Text>
            <Text style={styles.companyText}>{companyHighlighted}</Text>
            <Text style={styles.companyParen}>)</Text>
          </View>
        );
      } else {
        // If not showing the company, just render the name
        return (
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{nameHighlighted}</Text>
          </View>
        );
      }
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
                {transform: [{translateX: action1TranslateX}]},
              ]}>
              <TouchableOpacity
                onPress={handlePrintAndCheckIn}
                style={[
                  styles.rightActionButton,
                  {backgroundColor: colors.darkGrey, zIndex: 10},
                ]}>
                <Text style={styles.actionText}>Print</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.rightAction,
                {transform: [{translateX: action2TranslateX}]},
              ]}>
              <TouchableOpacity
                onPress={handleSwitchToggle}
                style={[
                  styles.rightActionButton,
                  {backgroundColor: isCheckedIn ? colors.red : colors.green},
                ]}>
                <Text style={[styles.actionText, {zIndex: 5}]}>
                  {isCheckedIn ? 'Uncheck' : 'Check'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        );
      },
      [isCheckedIn, selectedNodePrinter?.id]
    );

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={1}
        enableTrackpadTwoFingerGesture
        overshootRight={false}
        onSwipeableWillOpen={() => {
          isSwipeOpen.current = true;
        // Close any previously opened Swipeable
          if (openSwipeableRef && openSwipeableRef !== swipeableRef.current) {
            openSwipeableRef.close();
          }
          openSwipeableRef = swipeableRef.current;
          onSwipeableOpen?.(swipeableRef);
        }}
        >
        <TouchableWithoutFeedback onPress={handleItemPress} accessible={false}>
          <View style={styles.listItemContainer}>
            {/* Main Content */}
            <View style={styles.contentContainer}>
              {renderNameWithOptionalCompany()}
            </View>

              {/* Check icon */}
               {isCheckedIn && !isTypeModeActive ? (
                <Image
                  source={Accepted}
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
                      source={Accepted}
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
      </Swipeable>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // keeps text aligned nicely
  },
  // Base text style for the attendee's name
  nameText: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  // Parentheses around company
  companyParen: {
    fontSize: 12,
    color: colors.grey,
    fontStyle: 'italic',
  },
  // Text style specifically for the company name
  companyText: {
    fontSize: 12,
    color: colors.grey,
    fontStyle: 'italic',
  },
  // Style for highlighted portions of the text
  highlight: {
    color: colors.green,
    fontWeight: 'bold',
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
/*     opacity: 0.5, */
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedIconInsideIndicator: {
    width: 15,
    height: 15,
    tintColor: 'white',
  }
});
