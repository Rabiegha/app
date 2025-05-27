import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import type { Swipeable as SwipeableType } from 'react-native-gesture-handler';
import colors from '../../../../assets/colors/colors';

// Keep track of the currently open swipeable
let openSwipeableRef: SwipeableType | null = null;

interface SwipeableAttendeeItemProps {
  children: React.ReactNode;
  isCheckedIn: boolean;
  onSwipeableOpen?: (ref: React.RefObject<SwipeableType | null>) => void;
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
  const swipeableRef = useRef<SwipeableType>(null);

  // Swipe actions (Print + Check)
  const renderRightActions = useCallback(
    (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
      // Using the old Animated API with Swipeable from react-native-gesture-handler
      // instead of ReanimatedSwipeable which requires worklets
      const trans1 = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0],
      });

      const trans2 = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [50, 25, 0],
      });

      return (
        <View style={styles.actionsContainer}>
          <Animated.View
            style={[
              styles.rightAction,
              { transform: [{ translateX: trans1 }] },
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
              { transform: [{ translateX: trans2 }] },
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
    <ReanimatedSwipeable
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
    </ReanimatedSwipeable>
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
