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

import image from '../../../assets/images/icons/Gift.png';
import colors from '../../../assets/colors/colors';
import MaskedViewComponent from './MaskedView';
import Popup from './popup';

const {width, height} = Dimensions.get('window');
const BOX_SIZE      = width * 0.7;                // scan window size
const WINDOW_TOP    = (height - BOX_SIZE) / 2;    // centred vertically
const OVERLAY_COLOR = 'rgba(0,0,0,0.55)';       // dim shade
type Props = {
  onBarCodeRead?: (e: any) => void;
  goBack?: () => void;
  attendeeName: string;
  scanStatus: string;
  sessionScanStats?: React.ReactNode;
  mainPopupContent?: React.ReactNode;
  isButtonShown?: boolean;
  isButtonActive?: boolean;
  handleButtonPress,
};

  const MainScanComponent = ({   onBarCodeRead,
    goBack,
    attendeeName,
    scanStatus,
    sessionScanStats,
    mainPopupContent,
    isButtonShown = false,
    isButtonActive = false,
    handleButtonPress,
    ref, }: Props) => (
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
      {isButtonShown && (
        <TouchableOpacity
          onPress={handleButtonPress}
          style={[
            styles.bottomIcon,
            {backgroundColor: isButtonActive ? colors.green : 'black'},
          ]}>
          <Image source={image} style={styles.iconImage} resizeMode="contain" />
        </TouchableOpacity>
      )}

{/*         <TouchableOpacity style={styles.bottomIcon}>
          <Image source={image} style={styles.iconImage} resizeMode="contain" />
        </TouchableOpacity> */}
      </View> 

      {/* bottom pill indicator */}
      <View style={styles.indicator} />
    </RNCamera>
);

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
