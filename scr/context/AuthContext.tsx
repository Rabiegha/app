import axios from 'axios';
import React, {createContext, useState} from 'react';
import {BASE_URL} from '../config/config';
import {MMKV} from 'react-native-mmkv';
import {Buffer} from 'buffer';

const storage = new MMKV();
const encodeBase64 = value => Buffer.from(value).toString('base64');

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userStatus, setUserStatus] = useState(false);
  const [fail, setFail] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(
    storage.getString('current_user_login_details_id'),
  );

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
        storage.set('email', userInfo.email.toString());
        storage.set('user_id', userInfo.user_id.toString());
        storage.set('full_name', userInfo.full_name.toString());
        storage.set('login_status', true);
        storage.set(
          'current_user_login_details_id',
          response.data.user_details.current_user_login_details_id.toString(),
        );
        setCurrentUserId(
          response.data.user_details.current_user_login_details_id.toString(),
        );
        setUserStatus(userStatus);
        console.log('Valeurs stockées dans MMKV:', {
          email: userInfo.email,
          user_id: userInfo.user_id,
          full_name: userInfo.full_name,
          login_status: true,
          current_user_login_details_id:
            response.data.user_details.current_user_login_details_id,
        });
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
      if (!currentUserId) {
        console.log('Aucun utilisateur connecté trouvé.');
        return;
      }

      const response = await axios.post(
        // URL de l'API pour se deconnecter
        `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=${currentUserId}`,
      );
      console.log(response.data);
      if (response.data.status) {
        storage.set('user_id', '');
        console.log('Déconnexion réussie');
        storage.set('login_status', false);
        setCurrentUserId('');
        storage.set('current_user_login_details_id', '');
        setUserStatus(false);
        setUserInfo({});
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
      value={{login, userInfo, isLoading, userStatus, logout, fail, resetFail}}>
      {children}
    </AuthContext.Provider>
  );
};
