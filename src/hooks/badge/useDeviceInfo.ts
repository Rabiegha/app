import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface DeviceInfo {
  width: number;
  height: number;
  isTablet: boolean;
}

export const useDeviceInfo = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const { width, height } = Dimensions.get('window');
    return {
      width,
      height,
      isTablet: width > 768,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDeviceInfo({
        width: window.width,
        height: window.height,
        isTablet: window.width > 768,
      });
    });

    return () => subscription?.remove();
  }, []);

  return deviceInfo;
};
