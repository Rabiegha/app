declare module 'react-native-pinch-zoom-view' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface PinchZoomViewProps {
    style?: ViewStyle;
    children?: React.ReactNode;
  }

  export default class PinchZoomView extends Component<PinchZoomViewProps> {}
}
