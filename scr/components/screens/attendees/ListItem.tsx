import React, {useEffect, useState, useRef} from 'react';
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
import colors from '../../../../colors/colors';
import CustomSwitch from '../../elements/Switch';
import {useEvent} from '../../../context/EventContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Accepted from '../../../assets/images/icons/Accepted.png';

const {width} = Dimensions.get('window');

const ListItem = React.memo(
  ({item, searchQuery, onUpdateAttendee, onSwipeableOpen}) => {
    const navigation = useNavigation();
    const {triggerListRefresh} = useEvent();
    const swipeableRef = useRef(null);

    const initialSwitchState = item.attendee_status == 1;
    const [isSwitchOn, setIsSwitchOn] = useState(initialSwitchState);

    const handleSwitchToggle = async newValue => {
      setIsSwitchOn(newValue);
      const newAttendeeStatus = newValue ? 1 : 0;

      const updatedAttendee = {
        ...item,
        attendee_status: newAttendeeStatus,
      };

      try {
        await onUpdateAttendee(updatedAttendee); // Call the update function passed from List
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
      });
    };

    const renderRightActions = (progress, dragX) => {
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
              onPress={() => {
                // Perform your first action here, like delete or archive
              }}
              style={[
                styles.rightActionButton,
                {backgroundColor: colors.darkGrey, zIndex: 10},
              ]}>
              <Text style={styles.actionText}>Action 1</Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.rightAction,
              {transform: [{translateX: action2TranslateX}]},
            ]}>
            <TouchableOpacity
              onPress={() => {
                // Perform your second action here
              }}
              style={[
                styles.rightActionButton,
                {backgroundColor: colors.green},
              ]}>
              <Text style={[styles.actionText, {zIndex: 5}]}>Action 2</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={() => {
          onSwipeableOpen(swipeableRef);
        }}
        onSwipeableRightOpen={() => {
          // Trigger the action when swipe is fully opened
          console.log('Action 2 triggered');
        }}>
        <TouchableWithoutFeedback onPress={handleItemPress}>
          <View style={styles.listItemContainer}>
            <Text style={styles.itemName}>
              {highlightSearch(
                `${item.first_name} ${item.last_name}`,
                searchQuery,
              )}
            </Text>
            {isSwitchOn && (
              <Image
                source={Accepted}
                resizeMode="contain"
                style={{
                  width: 20,
                  height: 20,
                  tintColor: colors.green,
                }}
              />
            )}
            <CustomSwitch
              value={isSwitchOn}
              onValueChange={handleSwitchToggle}
            />
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
    alignItems: 'center',
    backgroundColor: colors.greyCream,
    borderRadius: 10,
    padding: 10,
    width: width * 0.89,
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
  },
});

export default ListItem;
