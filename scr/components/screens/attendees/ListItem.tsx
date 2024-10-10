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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../../../colors/colors';
import {useEvent} from '../../../context/EventContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Accepted from '../../../assets/images/icons/Accepted.png';
import usePrint from '../../../hooks/usePrint';
import {useNodePrint} from '../../../hooks/useNodePrint';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {useSelector} from 'react-redux';
import {setPrintStatus} from '../../../redux/printerSlice';
import {useDispatch} from 'react-redux';
import usePrintDocument from '../../../hooks/usePrintDocument';

const {width} = Dimensions.get('window');

const ListItem = React.memo(
  ({
    item,
    searchQuery,
    onUpdateAttendee,
    onSwipeableOpen,
    onPressedit,
    onPresscheck,
  }) => {
    const navigation = useNavigation();
    const {triggerListRefresh} = useEvent();
    const swipeableRef = useRef(null);
    const {handlePrint} = usePrint();
    const {sendPrintJob} = useNodePrint();

    const dispatch = useDispatch();

    const initialSwitchState = item.attendee_status == 1;
    const [isCheckedIn, setIsCheckedIn] = useState(initialSwitchState);

    // selectedWiFiPrinters
    const selectedWiFiPrinters = useSelector(
      state => state.printers.selectedWiFiPrinters,
    );

    const handleSwitchToggle = async newValue => {
      try {
        const newAttendeeStatus = item.attendee_status == 1 ? 0 : 1;
        setIsCheckedIn(newAttendeeStatus == 1);
        const updatedAttendee = {
          ...item,
          attendee_status: newAttendeeStatus,
        };
        await onUpdateAttendee(updatedAttendee);
        console.log('After status', updatedAttendee);
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

    // selectedNodePrinter
    const selectedNodePrinter = useSelector(
      state => state.printers.selectedNodePrinter,
    );

    const nodePrinterId = selectedNodePrinter?.id; // Get printer ID and fileType from context

    useEffect(() => {
      /*       console.log('Selected Node Printer ID:', nodePrinterId); */
    }, [nodePrinterId]);

    // Utiliser la fonction d'impression réutilisable

    const {printDocument} = usePrintDocument(item.id);

    const handlePrintDocument = () => {
      printDocument(item); // Passer l'objet 'item' comme paramètre
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
              onPress={handlePrintDocument}
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
                {backgroundColor: colors.green},
                {backgroundColor: isCheckedIn ? colors.red : colors.green},
              ]}>
              <Text style={[styles.actionText, {zIndex: 5}]}>
                {isCheckedIn ? 'Uncheck' : 'Check'}
              </Text>
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
        onSwipeableOpen={direction => {
          if (direction === 'right') {
            onSwipeableOpen(swipeableRef);
          }
        }}>
        <TouchableWithoutFeedback onPress={handleItemPress}>
          <View style={styles.listItemContainer}>
            <Text style={styles.itemName}>
              {highlightSearch(
                `${item.first_name} ${item.last_name}`,
                searchQuery,
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
              <View style={{width: 20, height: 20}} />
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
