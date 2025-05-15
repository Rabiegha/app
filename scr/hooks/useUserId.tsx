import {useSelector} from 'react-redux';

export default function useUserId() {
  const userId = useSelector(state => state.auth.userId);

  // Return the userId (and optionally dispatch if needed)
  return userId;
}
