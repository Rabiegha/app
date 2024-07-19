import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../../../colors/colors';
import Fermer from '../../../assets/images/icons/Fermer.png';
import closeButton from '../../../assets/images/icons/closeButton.png';

const FailComponent = ({onClose, text}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Si isVisible est true, démarrez l'animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.notification, {opacity: fadeAnim}]}>
      <View style={styles.textNotification}>
        <Image
          source={Fermer}
          resizeMode="contain"
          style={{
            width: 13,
            height: 13,
            tintColor: colors.red,
            marginRight: 10,
          }}
        />
        <Text style={styles.buttonText}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Image source={closeButton} style={styles.buttonImage} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: 'absolute',
    right: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.lightRed,
    paddingVertical: 15,
    paddingHorizontal: 15,
    zIndex: 50,
    marginHorizontal: 20,
  },
  textNotification: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  closeButton: {},
  buttonImage: {
    width: 15,
    height: 15,
    tintColor: colors.red,
    zIndex: 2,
    marginLeft: 10,
  },
});

export default FailComponent;
