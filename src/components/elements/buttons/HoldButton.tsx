import React, { useState, useRef } from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import colors from '../../../assets/colors/colors';
import { HoldButtonProps } from './HoldButton.types';

/**
 * Button component that requires the user to hold it for a specified duration
 * before triggering the onPress action
 */
const HoldButton: React.FC<HoldButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  holdColor = colors.lightGreen, // Color to change to during hold
  holdDuration = 3000,
  loading,
  style,
}) => {
  // State for tracking hold timeout and animation values
  const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const animatedValue = useRef<Animated.Value>(new Animated.Value(0)).current;
  const colorAnimatedValue = useRef<Animated.Value>(new Animated.Value(0)).current; // Animated value for color change

  /**
   * Handles the press-in event on the button
   * Starts the hold timer and animations
   */
  const handlePressIn = (): void => {
    if (loading) {
      return;
    }

    setIsHolding(true);
    const timeout = setTimeout(() => {
      onPress();
      setIsHolding(false);
    }, holdDuration);
    setHoldTimeout(timeout);

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: holdDuration,
      useNativeDriver: false,
    }).start();

    Animated.timing(colorAnimatedValue, {
      toValue: 1,
      duration: 300, // Duration for color change animation
      useNativeDriver: false,
    }).start();
  };

  /**
   * Handles the press-out event on the button
   * Cancels the hold timer and resets animations
   */
  const handlePressOut = (): void => {
    if (loading) {
      return;
    }

    if (holdTimeout) {
      clearTimeout(holdTimeout);
      setHoldTimeout(null);
    }
    setIsHolding(false);

    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(colorAnimatedValue, {
      toValue: 0,
      duration: 200, // Duration for color change animation
      useNativeDriver: false,
    }).start();
  };

  const buttonBackgroundColor = colorAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundColor, holdColor],
  });

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[styles.button, {backgroundColor: buttonBackgroundColor}]}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Text style={styles.buttonText}>{title}</Text>
            {isHolding && (
              <Animated.View
                style={[styles.progressBar, {width: progressWidth}]}
              />
            )}
          </>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const {width} = Dimensions.get('window');

/**
 * Styles for the HoldButton component
 */
const styles = StyleSheet.create<{
  button: ViewStyle;
  buttonText: TextStyle;
  progressBar: ViewStyle;
}>({
  button: {
    width: width - 40,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: 'white',
  },
});

export default HoldButton;
