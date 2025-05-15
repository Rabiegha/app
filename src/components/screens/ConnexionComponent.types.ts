import { StyleProp, ViewStyle } from 'react-native';

/**
 * Props for the ConnexionComponent
 */
export interface ConnexionComponentProps {
  /**
   * Username value for login
   */
  userName: string;
  
  /**
   * Password value for login
   */
  password: string;
  
  /**
   * Function to update the username
   */
  setUserName: (value: string) => void;
  
  /**
   * Function to update the password
   */
  setPassword: (value: string) => void;
  
  /**
   * Function to handle the login action
   */
  handleLogin: () => void;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
