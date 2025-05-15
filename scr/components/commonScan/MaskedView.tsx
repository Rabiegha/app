import React, { Component } from 'react'
import { Dimensions, Text, View, StyleSheet } from 'react-native'
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import MaskedView from '@react-native-masked-view/masked-view';

const  MaskedViewComponent = () => {


    const {width, height} = Dimensions.get('window');
        const BOX_SIZE      = width * 0.7;                // scan window size
        const WINDOW_TOP    = (height - BOX_SIZE) / 2;    // centred vertically
        const OVERLAY_COLOR = 'rgba(0,0,0,0.55)'; 
  
    return (
      <MaskedView
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        maskElement={
          <Svg width={width} height={height}>
            <Defs>
              {/* mask: white = visible, black = transparent */}
              <Mask id="hole">
                {/* everything visible */}
                <Rect x="0" y="0" width={width} height={height} fill="white" />
                {/* cut-out window */}
                <Rect
                  x={(width - BOX_SIZE) / 2}
                  y={WINDOW_TOP}
                  width={BOX_SIZE}
                  height={BOX_SIZE}
                  rx={20}
                  ry={20}
                  fill="black"
                />
              </Mask>
            </Defs>
            {/* attach the mask to a full-screen rect */}
            <Rect
              x="0"
              y="0"
              width={width}
              height={height}
              fill="white"
              mask="url(#hole)"
            />
          </Svg>
        }>
        {/* this View is shown wherever the mask-rect above is opaque */}
        <View style={[StyleSheet.absoluteFill, {backgroundColor: OVERLAY_COLOR}]} />
      </MaskedView>
    )
  }


  export default MaskedViewComponent;
