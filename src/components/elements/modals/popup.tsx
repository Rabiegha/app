import React from 'react'
import { Dimensions, Text, View, StyleSheet } from 'react-native'
import colors from '../../../assets/colors/colors';

type Props = {
    attendeeName : string,
    scanStatus: string,

  };

const  Popup = ({attendeeName, scanStatus}: Props) => {

  
    return (
        <View
        style={[
          styles.popupContainer,
          {
            backgroundColor:
              scanStatus === 'not_found' ? colors.red : colors.green,
          },
        ]}>
        <Text style={styles.popupText}>
          {scanStatus === 'not_found' ? 'Not found' : attendeeName}
        </Text>
      </View>
    )
  }


  const styles = StyleSheet.create({

      /* ─── The pop up ─── */
      popupContainer: {
        padding: 10,
        paddingHorizontal: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },      

  popupText: {
    color: colors.greyCream,
  },
  });

  export default Popup;
