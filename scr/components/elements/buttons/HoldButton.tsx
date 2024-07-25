import React, {useState, useRef} from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import colors from '../../../../colors/colors';

const HoldButton = ({
  title,
  onPress,
  backgroundColor,
  holdColor = colors.lightGreen, // Color to change to during hold
  holdDuration = 3000,
  loading,
}) => {
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [isHolding, setIsHolding] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const colorAnimatedValue = useRef(new Animated.Value(0)).current; // Animated value for color change

  const handlePressIn = () => {
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

  const handlePressOut = () => {
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

const styles = StyleSheet.create({
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
