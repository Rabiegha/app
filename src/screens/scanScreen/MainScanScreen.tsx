import React from 'react';
import ScanScreen from './ScanScreen';
import { ScanType } from '../../components/commonScan/types/scan';

/**
 * Pre-configured ScanScreen component for the Main scan type
 * This avoids using inline component functions in navigation configuration
 */
const MainScanScreen = () => {
  return <ScanScreen scanType={ScanType.Main} />;
};

export default MainScanScreen;
