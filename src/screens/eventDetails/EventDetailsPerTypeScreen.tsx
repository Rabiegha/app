// Using direct imports for hooks from react package
import {useEffect, useMemo} from 'react';
// Import React as a namespace (automatic JSX support)
import * as React from 'react/jsx-runtime';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';
import { VictoryPie } from 'victory-native';
import Svg, { G } from 'react-native-svg';

import {EventDetailsStackParamList} from '../../navigation/tabNavigator/EventDetailsNavigator';
import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import EventDetailsPerTypeComponent from '../../components/screens/EventDetailsPerTypeComponent';
import useDetailsPerType from '../../hooks/type/useDetailsPerType';
import MainHeader from '../../components/elements/header/MainHeader';



const widthAndHeight = 260;

interface DataItem {
  y: number;
  background_color: string;
  color?: string;
  label: string;
  [key: string]: number | string | undefined;
}

type Props = NativeStackScreenProps<EventDetailsStackParamList, 'EventDetailsPerTypeScreen'>;

const EventDetailsPerTypeScreen = ({route}: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<EventDetailsStackParamList, 'EventDetailsPerTypeScreen'>>();
  const {details, loading, error} = useDetailsPerType();

  const goBack = () => {
    navigation.goBack();
  };

  // Extract params and provide fallbacks for potentially null values
  const {state = '', total = 0} = route.params;

  // Use useMemo for data selection to stabilize dependencies
  const data = useMemo<DataItem[]>(() => {
    switch (state) {
      case 'registered':
        return details.totalRegisteredArr as DataItem[] || [];
      case 'attended':
        return details.totalAttendedArr as DataItem[] || [];
      case 'not_attended':
        return details.totalNotAttendedArr as DataItem[] || [];
      default:
        return [];
    }
  }, [state, details.totalRegisteredArr, details.totalAttendedArr, details.totalNotAttendedArr]);

  // Use useMemo to process data and avoid unnecessary recalculations
  const { series, sliceColor } = useMemo(() => {
    console.log('🔍 Raw DATA:', data);
    
    // Return empty arrays if no data
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('❌ No valid data provided');
      return { series: [], sliceColor: [] };
    }
    
    // Process and validate data
    const processedData: Array<{value: number, color: string}> = [];
    
    data.forEach((item: DataItem, index: number) => {
      console.log(`📊 Processing item ${index}:`, item);
      
      // Validate y value
      const yValue = typeof item.y === 'number' ? item.y : parseFloat(item.y);
      if (isNaN(yValue) || yValue <= 0) {
        console.log(`⚠️ Skipping item ${index}: invalid y value (${item.y})`);
        return;
      }
      
      // Determine color
      let itemColor = colors.grey; // default fallback
      
      if (typeof item.color === 'string' && item.color.trim() !== '') {
        itemColor = item.color.trim();
      } else if (typeof item.background_color === 'string' && item.background_color.trim() !== '') {
        itemColor = item.background_color.trim();
      }
      
      console.log(`✅ Adding item ${index}: value=${yValue}, color=${itemColor}`);
      processedData.push({ value: yValue, color: itemColor });
    });
    
    // Extract series and colors
    const seriesArr = processedData.map(item => item.value);
    const sliceColorArr = processedData.map(item => item.color);
    
    console.log('📈 Final series:', seriesArr);
    console.log('🎨 Final colors:', sliceColorArr);
    console.log('🔢 Arrays length match:', seriesArr.length === sliceColorArr.length);
    
    return {
      series: seriesArr,
      sliceColor: sliceColorArr
    };
  }, [data]);
  

  // The useEffect hook now has a stable dependency
  useEffect(() => {
    if (series.length > 0) {
      console.log('Chart data prepared', series.length, 'segments');
    }
  }, [series.length]);

  return (
    <View style={globalStyle.backgroundWhite}>
      <MainHeader
        title={'Details'}
        onLeftPress={goBack}
        />
      <ScrollView
        style={styles.screenWrapper}
        contentContainerStyle={styles.contentContainer}>
        <View style={globalStyle.container}>
          <View style={styles.list}>
            {loading ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : error ? (
              <Text>Error: {error}</Text>
            ) : (
              <View>
                <View style={styles.chartContainer}>
                  {(() => {
                    // Additional validation before rendering
                    const isValidData = series.length > 0 && 
                                      sliceColor.length > 0 && 
                                      series.length === sliceColor.length &&
                                      series.every((val: number) => typeof val === 'number' && !isNaN(val) && val > 0) &&
                                      sliceColor.every((color: string) => typeof color === 'string' && color.trim() !== '');
                    
                    console.log('🎯 Chart validation:', {
                      seriesLength: series.length,
                      colorsLength: sliceColor.length,
                      lengthMatch: series.length === sliceColor.length,
                      validSeries: series.every((val: number) => typeof val === 'number' && !isNaN(val) && val > 0),
                      validColors: sliceColor.every((color: string) => typeof color === 'string' && color.trim() !== ''),
                      isValidData
                    });
                    
                    if (isValidData) {
                      try {
                        return (
                          <View style={styles.donutWrapper}>
                            <Svg width={widthAndHeight} height={widthAndHeight}>
                              <G>
                                <VictoryPie
                                  standalone={false}
                                  width={widthAndHeight}
                                  height={widthAndHeight}
                                  innerRadius={115} // 👈 trou central
                                  data={series.map((val: number, index: number) => ({
                                    x: `Item ${index + 1}`,
                                    y: val,
                                  }))}
                                  colorScale={sliceColor}
                                  labels={() => null} // pas de labels autour
                                />
                              </G>
                            </Svg>
                          </View>
                        

                        );
                      } catch (error) {
                        console.error('🚨 PieChart render error:', error);
                        return (
                          <View style={[styles.chartContainer, styles.noDataContainer]}>
                            <Text style={styles.noDataText}>Chart render error</Text>
                          </View>
                        );
                      }
                    } else {
                      return (
                        <View style={[styles.chartContainer, styles.noDataContainer]}>
                          <Text style={styles.noDataText}>
                            {series.length === 0 ? 'No data available' : 
                             series.length !== sliceColor.length ? `Data mismatch: ${series.length} vs ${sliceColor.length}` :
                             !series.every((val: number) => typeof val === 'number' && !isNaN(val) && val > 0) ? 'Invalid series values' :
                             'Invalid color format'}
                          </Text>
                        </View>
                      );
                    }
                  })()}
                  <View style={styles.chartText}>
                    <Text style={styles.titleTotalText}>
                      Total des enregistrements
                    </Text>
                    <Text style={styles.totalText}>{total}</Text>
                  </View>
                </View>
                {data && Array.isArray(data) && data.length > 0 ? (
                  <EventDetailsPerTypeComponent data={data.map(item => ({
                    label: item.label || `Item ${item.name || ''}`,
                    y: Number(item.y || item.value || 0),
                    background_color: item.background_color || item.color || '#cccccc'
                  }))} />
                ) : null}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    height: widthAndHeight,
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
    width: widthAndHeight,
  },
  chartText: {
    position: 'absolute',
  },
  contentContainer: {
    flexGrow: 1,
  },
  donutWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  list: {
    marginBottom: 50,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: colors.darkGrey,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  screenWrapper: {
    flex: 1,
  },
  titleTotalText: {
    color: colors.darkGrey,
    fontSize: 17,
    textAlign: 'center',
    width: 140,
  },
  totalText: {
    color: colors.green,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventDetailsPerTypeScreen;
