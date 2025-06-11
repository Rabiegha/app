import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import colors from '../../../../assets/colors/colors';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

type SwipeableRefType = React.ElementRef<typeof ReanimatedSwipeable>;
let openSwipeableRef: SwipeableRefType | null = null;

interface SwipeableAttendeeItemProps {
  children: React.ReactNode;
  isCheckedIn: boolean;
  onSwipeableOpen?: (ref: React.RefObject<SwipeableRefType | null>) => void;
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
  const swipeableRef = useRef<SwipeableRefType>(null);
  const progressShared = useSharedValue(0);
  const hasClosedOtherSwipeable = useSharedValue(false);

  const handleSwipeStart = () => {
    if (openSwipeableRef && openSwipeableRef !== swipeableRef.current) {
      try {
        openSwipeableRef.close();
      } catch (err) {
        console.warn('Failed to close swipeable:', err);
      }
    }
    openSwipeableRef = swipeableRef.current;
    onSwipeableOpen?.(swipeableRef);
  };

  useAnimatedReaction(
    () => progressShared.value,
    (current, prev) => {
      if (
        current > 0.01 &&
        (prev ?? 0) <= 0.01 &&
        !hasClosedOtherSwipeable.value
      ) {
        hasClosedOtherSwipeable.value = true;
        runOnJS(handleSwipeStart)();
      }

      if (current <= 0.01) {
        hasClosedOtherSwipeable.value = false;
      }
    }
  );

  const renderRightActions = (progress: SharedValue<number>) => {
    // ✅ Sync progress continuously
    useDerivedValue(() => {
      progressShared.value = progress.value;
    });

    const animatedStyle1 = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [100, 0], Extrapolate.CLAMP),
        },
      ],
    }));

    const animatedStyle2 = useAnimatedStyle(() => ({
      transform: [
        {
          translateX: interpolate(progress.value, [0, 0.5, 1], [50, 25, 0], Extrapolate.CLAMP),
        },
      ],
    }));

    return (
      <View style={styles.actionsContainer}>
        <Animated.View style={[styles.rightAction, animatedStyle1]}>
          <TouchableOpacity
            onPress={onPrintAndCheckIn}
            style={[styles.rightActionButton, { backgroundColor: colors.darkGrey }]}
          >
            <Text style={styles.actionText}>Print</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.rightAction, animatedStyle2]}>
          <TouchableOpacity
            onPress={onToggleCheckIn}
            style={[
              styles.rightActionButton,
              { backgroundColor: isCheckedIn ? colors.red : colors.green },
            ]}
          >
            <Text style={styles.actionText}>{isCheckedIn ? 'Uncheck' : 'Check'}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={1}
      enableTrackpadTwoFingerGesture
      overshootRight={false}
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
