import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import ConnexionComponent from '../components/screens/ConnexionComponent';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import FailComponent from '../components/elements/notifications/FailComponent';

const ConnexionScreen = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const {isLoading, login, fail, resetFail, setIsDemoMode} =
    useContext(AuthContext);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    return () => {
      // Reset the status bar style when MenuScreen component unmounts
      StatusBar.setBarStyle('default');
    };
  }, []);

  const handleDemoLogin = () => {
    setIsDemoMode(true); // Activez le mode démo
    navigation.navigate('Events'); // Naviguez vers l'écran des événements
  };

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      <Spinner visible={isLoading} />
      {fail === true && (
        <View style={styles.failComponentContainer}>
          <FailComponent
            onClose={() => resetFail()}
            text={'Erreur de connexion'}
          />
        </View>
      )}
      <View style={styles.container}>
        <Text style={styles.title}>Log in</Text>
        <ConnexionComponent
          userName={userName}
          password={password}
          setUserName={text => setUserName(text)}
          setPassword={text => setPassword(text)}
          handleLogin={() => {
            login(userName, password);
            resetFail();
          }}
        />
        <View style={styles.demoModeContainer}>
          <TouchableOpacity
            onPress={handleDemoLogin}
            style={styles.demoModeButton}>
            <Text style={styles.demoModeText}>Activer le mode démo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  failComponentContainer: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
  },
  demoModeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  demoModeButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  demoModeText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ConnexionScreen;
