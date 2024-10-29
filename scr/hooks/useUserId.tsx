import {useState, useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

export default function useUserId() {
  const [userId, setUserId] = useState(
    storage.getString('current_user_login_details_id'),
  );

  return [userId, setUserId];
}
