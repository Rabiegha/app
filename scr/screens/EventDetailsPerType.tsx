import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent.tsx';
import {useNavigation} from '@react-navigation/native';
import globalStyle from '../assets/styles/globalStyle.tsx';
import colors from '../../colors/colors.ts';
import EventDetailsPerTypeComponent from '../components/screens/EventDetailsPerTypeComponent.tsx';
import useDetailsPerType from '../hooks/useDetailsPerType.tsx';
import PieChart from 'react-native-pie-chart';

const widthAndHeight = 230;

const EventDetailsPerTypeScreen = ({route}) => {
  const navigation = useNavigation();
  const {details, loading, error} = useDetailsPerType();

  const goBack = () => {
    navigation.goBack();
  };

  const {state, total} = route.params;

  useEffect(() => {
    console.log('total', total);
    console.log('state', state);
  }, [details, state]);

  let data;
  switch (state) {
    case 'registered':
      data = details.totalRegisteredArr;
      break;
    case 'attended':
      data = details.totalAttendedArr;
      break;
    case 'not_attended':
      data = details.totalNotAttendedArr;
      break;
    default:
      data = [];
  }

  let series = [];
  let sliceColor = [];

  if (data && data.length > 0) {
    series = data.map(item => item.y);
    sliceColor = data.map(item => item.background_color);
  }

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title="Details"
        color={colors.darkGrey}
        handlePress={goBack}
        backgroundColor={'white'}
      />
      <ScrollView
        style={styles.screenWrapper}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={globalStyle.container}>
          <View style={styles.list}>
            {loading ? (
              <ActivityIndicator size="large" color="#00ff00" />
            ) : error ? (
              <Text>Error: {error}</Text>
            ) : (
              <View>
                <View style={styles.chartContainer}>
                  <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    sliceColor={sliceColor}
                    coverRadius={0.75}
                    coverFill={'#FFF'}
                  />
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
    justifyContent: 'center',
    position: 'relative',
    width: widthAndHeight,
    height: widthAndHeight,
    alignSelf: 'center',
    marginBottom: 40,
  },
  chartText: {
    position: 'absolute',
  },
  titleTotalText: {
    fontSize: 13,
    color: colors.darkGrey,
    textAlign: 'center',
    width: 140,
  },
  totalText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: colors.green,
    textAlign: 'center',
  },
  list: {
    marginBottom: 50,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: colors.darkGrey,
  },
});

export default EventDetailsPerTypeScreen;
