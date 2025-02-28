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
import colors from '../../../assets/colors/colors';
import {useEvent} from '../../../context/EventContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Accepted from '../../../assets/images/icons/Accepted.png';
import {useSelector} from 'react-redux';
import {setPrintStatus} from '../../../redux/slices/printerSlice';
import {useDispatch} from 'react-redux';
import usePrintDocument from '../../../hooks/print/usePrintDocument';

const {width} = Dimensions.get('window');

const ListItem = React.memo(
  ({item, searchQuery, onUpdateAttendee, onSwipeableOpen}) => {
    const navigation = useNavigation();
    const {triggerListRefresh} = useEvent();
    const swipeableRef = useRef(null);

    const dispatch = useDispatch();

    const initialSwitchState = item.attendee_status == 1;
    const [isCheckedIn, setIsCheckedIn] = useState(initialSwitchState);

    const handleSwitchToggle = async newValue => {
      try {
        const newAttendeeStatus = item.attendee_status == 1 ? 0 : 1;
        setIsCheckedIn(newAttendeeStatus == 1);
        const updatedAttendee = {
          ...item,
          attendee_status: newAttendeeStatus,
        };
        await onUpdateAttendee(updatedAttendee);
/*         console.log('After status', updatedAttendee); */
        triggerListRefresh(); // Refresh the list after updating
      } catch (error) {
        console.error('Error updating attendee status:', error);
      }
    };

    const highlightSearch = (text, query) => {
      if (!query.trim()) {
        return <Text style={{color: 'black'}}>{text}</Text>;
      }

      const regex = new RegExp(`(${query.trim()})`, 'gi');
      const parts = text.split(regex);

      return parts
        .filter(part => part)
        .map((part, index) =>
          regex.test(part) ? (
            <Text key={index} style={{color: colors.green, fontWeight: 'bold'}}>
              {part}
            </Text>
          ) : (
            <Text key={index} style={{color: 'black'}}>
              {part}
            </Text>
          ),
        );
    };

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
      });
    };

    // selectedNodePrinter
    const selectedNodePrinter = useSelector(
      state => state.printers.selectedNodePrinter,
    );

    //Node printer id

    const nodePrinterId = selectedNodePrinter?.id;

    const badgeurl = item.badge_pdf_url;

    useEffect(() => {
      console.log('badgeurl', badgeurl);
      /*       console.log('Selected Node Printer ID:', nodePrinterId); */
    }, [nodePrinterId, badgeurl]);

    // Print hook

    const {printDocument} = usePrintDocument();

    const handlePrintDocument = () => {
      printDocument(badgeurl);
      handleSwitchToggle();
    };

    const renderRightActions = useCallback((progress, dragX) => {
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
              onPress={handlePrintDocument}
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
    }, [isCheckedIn]);


    return (
      <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          friction={1} // Rend l'animation plus fluide
          enableTrackpadTwoFingerGesture // Permet le swipe sur Mac avec trackpad
          overshootRight={false}
          onSwipeableWillOpen={() => {
            onSwipeableOpen(swipeableRef);
          }}
          onSwipeableOpen={(direction) => {
            if (direction === 'right') {
              onSwipeableOpen(swipeableRef);
            }
          }}
        >
          <TouchableWithoutFeedback onPress={handleItemPress} accessible={false}>
            <View style={styles.listItemContainer}>
              <Text style={styles.itemName}>
                {highlightSearch(
                  `${item.first_name} ${item.last_name}`,
                  searchQuery
                )}
              </Text>
              {isCheckedIn ? (
                <Image
                  source={Accepted}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: colors.green,
                  }}
                />
              ) : (
                <View style={{ width: 20, height: 20 }} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </Swipeable>

    );
  },
);

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    height: 55,
  },
  itemName: {
    fontSize: 16,
    color: colors.darkGrey,
  },
  actionsContainer: {
    width: 140, // Adjust this to fit both action buttons
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
    width: 60,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ListItem;
