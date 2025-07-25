import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PieChart from 'react-native-pie-chart';

import globalStyle from '../../assets/styles/globalStyle';
import colors from '../../assets/colors/colors';
import EventDetailsPerTypeComponent from '../../components/screens/EventDetailsPerTypeComponent';
import useDetailsPerType from '../../hooks/type/useDetailsPerType';
import MainHeader from '../../components/elements/header/MainHeader';

const widthAndHeight = 230;

interface DataItem {
  y: number;
  background_color?: string;
  color?: string;
  [key: string]: any;
}

const EventDetailsPerTypeScreen = ({route}: {route: {params: {state: string; total: number}}}) => {
  const navigation = useNavigation();
  const {details, loading, error} = useDetailsPerType();

  const goBack = () => {
    navigation.goBack();
  };

  const {state, total} = route.params;

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
    // Start with empty arrays
    const seriesArr: number[] = [];
    const sliceColorArr: string[] = [];
    
    // Process data only if we have items
    const enhancedData: DataItem[] = data.map((item: DataItem) => {
      const validColor =
        (typeof item.color === 'string' && item.color.trim() !== '')
          ? item.color
          : (typeof item.background_color === 'string' && item.background_color.trim() !== '')
            ? item.background_color
            : colors.grey;
    
      return {
        ...item,
        color: validColor
      };
    });



  console.log('✅ DATA:', data);
  console.log('✅ Enhanced Data (after adding color):', enhancedData);
    
    
    // Filter out any items with falsy y values to avoid empty slices
    const validItems: DataItem[] = enhancedData.filter(item => {
      return item.y && typeof item.y === 'number' && item.y > 0;
    });


    seriesArr.forEach((val, idx) => {
      console.log(`Slice ${idx} => y: ${val}, color: ${sliceColorArr[idx]}`);
    });
    
    console.log('✅ Valid Items (with y > 0):', validItems);
    
    // Only populate series and sliceColor arrays from valid data
    if (validItems.length > 0) {
      // Create series and sliceColor arrays simultaneously to ensure they match
      validItems.forEach(item => {
        // Only add items that have both y value and a color
        if (item.y && item.color) {
          seriesArr.push(item.y);
          sliceColorArr.push(item.color);
        }
      });
    }

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
                  {series.length > 0 && sliceColor.length > 0 && series.length === sliceColor.length ? (
                    <PieChart
                      widthAndHeight={widthAndHeight}
                      series={series}
                      sliceColor={sliceColor as string[]}
                      coverRadius={0.75}
                      coverFill={'#FFF'}
                    />
                  ) : (
                    <View style={[styles.chartContainer, styles.noDataContainer]}>
                      <Text style={styles.noDataText}>No data available</Text>
                    </View>
                  )}
                  <View style={styles.chartText}>
                    <Text style={styles.titleTotalText}>
                      Total des enregistrements
                    </Text>
                    <Text style={styles.totalText}>{total}</Text>
                  </View>
                </View>
                <EventDetailsPerTypeComponent data={data} />
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
    fontSize: 13,
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
