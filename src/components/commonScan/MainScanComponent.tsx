// SessionsScanScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Svg, {Defs, Mask, Rect} from 'react-native-svg';

import Icons from '../../assets/images/icons';
import colors from '../../assets/colors/colors';
import MaskedViewComponent from './MaskedView';
import Popup from '../elements/modals/popup';
import { useSelector } from 'react-redux';
import { selectUserType } from '@/redux/selectors/auth/authSelectors';

const {width, height} = Dimensions.get('window');
const BOX_SIZE      = width * 0.7;                // scan window size
const WINDOW_TOP    = (height - BOX_SIZE) / 2;    // centred vertically
const OVERLAY_COLOR = 'rgba(0,0,0,0.55)';

type Props = {
  onBarCodeRead?: (e: any) => void;
  goBack?: () => void;
  attendeeName: string;
  scanStatus: string;
  sessionScanStats?: React.ReactNode;
  mainPopupContent?: React.ReactNode;
  isButtonShown?: boolean;
  isGiftModeActive?: boolean;
  isPrintModeActive: boolean;
  handleGiftButtonPress: () => void;
  handlePrintButtonPress: () => void;
  ref?: React.RefObject<RNCamera>;
};

const MainScanComponent = ({
    onBarCodeRead,
    goBack,
    attendeeName,
    scanStatus,
    sessionScanStats,
    mainPopupContent,
    isButtonShown = false,
    isGiftModeActive = false,
    isPrintModeActive = false,
    handleGiftButtonPress,
    handlePrintButtonPress,
    ref,
}: Props) => {
  const userType = useSelector(selectUserType);

  // Determine if user is a partner
  const isPartner = userType?.toLowerCase() === 'partner';
  
  return (
    <RNCamera
      ref={ref}
      style={styles.camera}
      type={RNCamera.Constants.Type.back} 
      barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      captureAudio={false}
      onBarCodeRead={onBarCodeRead}>
        
      {/* ────── Dim overlay with SVG mask ────── */}
      <MaskedViewComponent />

      {/* white border around the hole */}
      <View
        pointerEvents="none"
        style={[
          styles.scanBox,
          {
            width:  BOX_SIZE,
            height: BOX_SIZE,
            top:    WINDOW_TOP,
            left:  (width - BOX_SIZE) / 2,
          },
        ]}
      />
        {/* pop up text */}
       {/* (scanStatus === 'not_found' || scanStatus === 'found')
      */}
        {(scanStatus === 'not_found' || scanStatus === 'found') && (
            <View style={styles.popupContainer}>
              <Popup attendeeName={attendeeName} scanStatus={scanStatus} />
            </View>
          )}

      {/* ────── TOP BAR ────── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Qr code Scan</Text>
      </View>



    {/* ────── Popup ────── */}
      <View style={styles.statsWrapper}>
        {sessionScanStats}
      </View>

      {/* ────── mainScreenPopup ────── */}
      <View style={styles.mainScreenPopup}>
        {mainPopupContent}
      </View>


      {/* ────── BOTTOM ACTIONS ────── */}
      <View style={styles.bottomButtons}>
      {(isButtonShown && !isPartner) && (
        <>
          <TouchableOpacity
            onPress={handleGiftButtonPress}
            style={[
              styles.bottomIcon,
              { backgroundColor: isGiftModeActive ? colors.green : 'black' },
            ]}
          >
            <Image source={Icons.Gift} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePrintButtonPress}
            style={[
              styles.bottomIcon,
              { backgroundColor: isPrintModeActive ? colors.green : 'black' },
            ]}
          >
            <Image source={Icons.Print} style={styles.iconImage} resizeMode="contain" />
          </TouchableOpacity>
        </>
      )}

      </View> 

      {/* bottom pill indicator */}
      <View style={styles.indicator} />
    </RNCamera>
  );
};

const styles = StyleSheet.create({
  camera:    {flex: 1},

  /* ─── Top bar ─── */
  topBar: {
    marginTop: 60,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 999,
  },
  
  closeButton: {
    position: 'absolute',
    left: 30,
    backgroundColor: '#333',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {color: '#fff', fontSize: 22, fontWeight: '600'},
  title:     {color: 'white', fontSize: 18, fontWeight: '600'},

  /* ─── satats ─── */
  statsWrapper: {
    position: 'absolute',
    top: 170,               // positionne en bas, hors du scanBox
    width: '100%',
    alignItems: 'center',
    zIndex: 999,
  },
  
  /* ─── Border ─── */
  scanBox: {
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20,
    zIndex: 1,
  },

  /* ─── Bottom controls ─── */
  bottomButtons: {
    position: 'absolute',
    bottom: 110,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    zIndex: 1000,
  },
  bottomIcon: {backgroundColor: colors.green, padding: 18, borderRadius: 50},
  iconImage:  {width: 35, height: 35, tintColor: 'white'},

  /* ─── Pill indicator ─── */
  indicator: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    height: 5,
    width: 130,
    backgroundColor: 'white',
    borderRadius: 3,
    zIndex: 2,
  },

  popupContainer: {
    position: 'absolute',
    top: height / 2 - 40,       // adjust vertically
    alignSelf: 'center',     // adjust horizontally
    zIndex: 999,
  },

  mainScreenPopup: {

  }

});

export default MainScanComponent;
