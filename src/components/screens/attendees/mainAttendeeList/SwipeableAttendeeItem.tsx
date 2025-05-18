import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import colors from '../../../../assets/colors/colors';

// Keep track of the currently open swipeable
let openSwipeableRef: Swipeable | null = null;

interface SwipeableAttendeeItemProps {
  children: React.ReactNode;
  isCheckedIn: boolean;
  onSwipeableOpen?: (ref: React.RefObject<Swipeable | null>) => void;
  onPrintAndCheckIn: () => void;
  onToggleCheckIn: () => void;
}

const SwipeableAttendeeItem: React.FC<SwipeableAttendeeItemProps> = ({
  children,
  isCheckedIn,
  onSwipeableOpen,
  onPrintAndCheckIn,
  onToggleCheckIn,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  // Swipe actions (Print + Check)
  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
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
              onPress={onPrintAndCheckIn}
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
              onPress={onToggleCheckIn}
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
    [isCheckedIn, onPrintAndCheckIn, onToggleCheckIn]
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={1}
      enableTrackpadTwoFingerGesture
      overshootRight={false}
      onSwipeableWillOpen={() => {
        // Close any previously opened Swipeable
        if (openSwipeableRef && openSwipeableRef !== swipeableRef.current) {
          openSwipeableRef.close();
        }
        openSwipeableRef = swipeableRef.current;
        if (swipeableRef.current) {
          onSwipeableOpen?.(swipeableRef);
        }
      }}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
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
});

export default SwipeableAttendeeItem;
