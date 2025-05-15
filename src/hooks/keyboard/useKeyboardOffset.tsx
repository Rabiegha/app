import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';

export default function useKeyboardOffset() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [bottomPadding, setBottomPadding] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardOffset(e.endCoordinates.height);
      setBottomPadding(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
      setBottomPadding(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {keyboardOffset, bottomPadding};
}
