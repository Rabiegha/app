import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';
import ConnexionComponent from '../../components/screens/ConnexionComponent';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../../assets/styles/globalStyle';
import Spinner from 'react-native-loading-spinner-overlay';
import FailComponent from '../../components/elements/notifications/FailComponent';
import {loginThunk} from '../../redux/thunks/auth/loginThunk';
import {useDispatch, useSelector} from 'react-redux';
import {resetError} from '../../redux/slices/authSlice';
import {
  selectError,
  selectIsLoading,
} from '../../redux/selectors/auth/authSelectors';

const ConnexionScreen = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [success, setSuccess] = useState(null);

  /*   const {isLoading, login, fail, resetFail, setIsDemoMode} =
    useContext(AuthContext); */

  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  useEffect(() => {
    StatusBar.setBarStyle('dark-content');
    return () => {
      // Reset the status bar style when MenuScreen component unmounts
      StatusBar.setBarStyle('default');
    };
  }, []);

  /*   const handleDemoLogin = () => {
    setIsDemoMode(true); // Activez le mode démo
    navigation.navigate('Events'); // Naviguez vers l'écran des événements
  }; */

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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetError());
      }, 5000); // Reset error after 5 seconds

      return () => clearTimeout(timer); // Cleanup if component unmounts
    }
  }, [error, dispatch]); // Runs when error changes

  return (
    <View style={[globalStyle.backgroundWhite, styles.container]}>
      {error && (
        <FailComponent
          onClose={() => dispatch(resetError())}
          text={"Mot de passe ou nom d'utilisateur incorrect"}
        />
      )}
      <Spinner visible={isLoading} />
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
