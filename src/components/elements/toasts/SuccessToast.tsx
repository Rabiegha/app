import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Icons from '../../../assets/images/icons';
import colors from '../../../assets/colors/colors';
import Toast from 'react-native-toast-message';

interface SuccessToastProps {
  text1: string;
  text2?: string;
  [key: string]: any; // For the rest parameter
}

const SuccessToast = ({text1, text2, ...rest}: SuccessToastProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value

  useEffect(() => {
    // Si isVisible est true, démarrez l'animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Durée plus courte pour un effet rapide
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

    const handleClose = () => {
      Toast.hide();
    };
  

  return (
    <Animated.View style={[styles.notification, {opacity: fadeAnim}]}>
      <View style={styles.textNotification}>
        <Image
          source={Icons.Verifie}
          resizeMode="contain"
          style={{
            width: 15,
            height: 15,
            tintColor: colors.green,
            marginRight: 10,
          }}
        />
        <Text style={styles.buttonText}>{text1}</Text>
        {text2 ? <Text style={styles.buttonText}>{text2}: </Text> : null}
      </View>
      <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
        <Image source={Icons.closeButton} style={styles.buttonImage} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.green,
    backgroundColor: colors.lightGreen,
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 500,
    marginHorizontal: 20,
  },
  textNotification: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.green,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  closeButton: {},
  buttonImage: {
    width: 15,
    height: 15,
    tintColor: colors.green,
    zIndex: 2,
    marginLeft: 10,
  },
});
export default SuccessToast;
