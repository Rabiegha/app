import { StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';

/**
 * Props for the EventDachboardTopComponent
 */
export interface EventDachboardTopComponentProps {
  /**
   * URL of the event image
   */
  eventImage?: string;
  
  /**
   * Name of the event
   */
  eventName: string;
  
  /**
   * Details about the event
   */
  eventDetails: string;
  
  /**
   * Optional custom styles for the container
   */
  style?: StyleProp<ViewStyle>;
}
