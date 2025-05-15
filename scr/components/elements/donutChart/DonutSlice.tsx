import React, {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {Path} from 'react-native-svg-web'; // from "react-native-svg"
import {arc} from 'd3-shape';

const isWeb = Platform.OS === 'web';

const DONUT_SIZE = 180;

const activeArcLoader = arc()
  .innerRadius(65 - 2)
  .outerRadius(DONUT_SIZE / 2 + 2 * 2.5);

const arcLoader = arc()
  .outerRadius(DONUT_SIZE / 2)
  .innerRadius(65);

const PieSlice = ({isActive, color, arcData, onSelected}) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    setPath(isActive ? activeArcLoader(arcData) : arcLoader(arcData));
  }, [isActive, arcData]);

  return (
    <Path
      d={path}
      stroke={color}
      fill={color}
      {...{[isWeb ? 'onClick' : 'onPress']: onSelected}}
      style={{cursor: 'pointer'}}
    />
  );
};

export default PieSlice;
