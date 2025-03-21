import axios from 'axios';
import React, {createContext, useState} from 'react';
import {BASE_URL} from '../config/config';
import {MMKV} from 'react-native-mmkv';
import {Buffer} from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CommonActions,
  useNavigationContainerRef,
} from '@react-navigation/native';

const storage = new MMKV();
const encodeBase64 = value => Buffer.from(value).toString('base64');

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const navigationRef = useNavigationContainerRef();
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userStatus, setUserStatus] = useState(false);
  const [fail, setFail] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(
    storage.getString('current_user_login_details_id'),
  );
  const [isDemoMode, setIsDemoMode] = useState(false); // Ajout de l'état pour le mode démo

  const login = async (email, password) => {
    const encUserName = encodeURIComponent(encodeBase64(email));
    const encPassword = encodeURIComponent(encodeBase64(password));
    setIsLoading(true);
    // URL de l'API pour se connecter
    const url = `${BASE_URL}/ajax_user_login/?enc_email=${encUserName}&enc_password=${encPassword}`;

    try {
      const response = await axios.post(url);
      const userStatus = response.data.status;

      if (userStatus) {
        let userInfo = response.data.user_details;
        setUserInfo(userInfo);
        await AsyncStorage.setItem('email', userInfo.email.toString());
        await AsyncStorage.setItem('user_id', userInfo.user_id.toString());
        await AsyncStorage.setItem('full_name', userInfo.full_name.toString());
        await AsyncStorage.setItem('login_status', 'true'); // store as a string
        await AsyncStorage.setItem(
          'current_user_login_details_id',
          userInfo.current_user_login_details_id.toString(),
        );
        setCurrentUserId(
          response.data.user_details.current_user_login_details_id.toString(),
        );
        setUserStatus(userStatus);
      } else {
        console.error(
          'Erreur lors de la connexion: structure de réponse incorrecte',
        );
        setFail(true);
        setUserStatus(userStatus);
      }
    } catch (error) {
      setFail(true);
      setUserStatus(userStatus);
      console.error('Erreur lors de la connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isDemoMode) {
        setIsDemoMode(false);
        setUserStatus(false);
        setUserInfo({});
        await AsyncStorage.clear();
        setIsLoading(false);
        return;
      }
      if (!currentUserId) {
        console.log('Aucun utilisateur connecté trouvé.');
        return;
      }

      const response = await axios.post(
        // URL de l'API pour se deconnecter
        `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=${currentUserId}`,
      );
      /* console.log(response.data); */
      if (response.data.status) {
        storage.set('user_id', '');
        console.log('Déconnexion réussie');
        storage.set('login_status', false);
        setCurrentUserId('');
        storage.set('current_user_login_details_id', '');
        setUserStatus(false);
        setUserInfo({});
        await AsyncStorage.clear();
        navigationRef.current?.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{name: 'Connexion'}],
          }),
        );
      } else {
        console.log('Échec de la déconnexion');
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const resetFail = () => {
    setFail(false);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        userInfo,
        isLoading,
        userStatus,
        logout,
        fail,
        resetFail,
        isDemoMode,
        setIsDemoMode,
        navigationRef,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
