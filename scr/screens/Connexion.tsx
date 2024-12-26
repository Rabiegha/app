import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import ConnexionComponent from '../components/screens/ConnexionComponent';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle';
import Spinner from 'react-native-loading-spinner-overlay';
import FailComponent from '../components/elements/notifications/FailComponent';
import {loginThunk} from '../redux/thunks/auth/loginThunk';
import {useDispatch, useSelector} from 'react-redux';
import {resetError} from '../redux/slices/auth/authSlice';

const ConnexionScreen = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [success, setSuccess] = useState(null);

  /*   const {isLoading, login, fail, resetFail, setIsDemoMode} =
    useContext(AuthContext); */

  const {isLoading, error} = useSelector(state => state.auth);
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

  const dispatch = useDispatch();

  const handleLogin = (userName, password) => {
    dispatch(
      loginThunk({
        email: userName,
        password: password,
      }),
    );
    dispatch(resetError());
  };

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      {success === false && (
        <FailComponent
          onClose={() => setSuccess(null)}
          text={"Mot de passe ou nom d'utilisateur incorrect"}
        />
      )}
      <Spinner visible={isLoading} />
      {error === true && (
        <View style={styles.failComponentContainer}>
          <FailComponent
            // Instead of resetFail()
            onClose={() => dispatch(resetError())}
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
            handleLogin(userName, password);
            dispatch(resetError());
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
    top: 100,
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
