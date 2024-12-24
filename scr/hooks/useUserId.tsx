import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useUserId() {
  const [userId, setUserIdState] = useState('');

  // On mount, load from AsyncStorage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('current_user_login_details_id');
        if (storedUserId) {
          setUserIdState(storedUserId);
        }
      } catch (error) {
        console.error('Error reading userId from AsyncStorage:', error);
      }
    };
    loadUserId();
  }, []);

  // Helper function to update both state and AsyncStorage
  const setUserIdInStorage = async newUserId => {
    try {
      await AsyncStorage.setItem('current_user_login_details_id', newUserId);
      setUserIdState(newUserId);
    } catch (error) {
      console.error('Error saving userId to AsyncStorage:', error);
    }
  };

  return [userId, setUserIdInStorage];
}
