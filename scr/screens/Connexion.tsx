import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, StatusBar} from 'react-native';
import ConnexionComponent from '../components/screens/ConnexionComponent';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import FailComponent from '../components/elements/notifications/FailComponent';

const ConnexionScreen = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const {isLoading, login, fail, resetFail} = useContext(AuthContext);
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    return () => {
      // Reset the status bar style when MenuScreen component unmounts
      StatusBar.setBarStyle('default');
    };
  }, []);

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
});

export default ConnexionScreen;
