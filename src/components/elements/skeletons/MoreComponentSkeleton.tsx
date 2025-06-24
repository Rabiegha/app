import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import colors from '../../../assets/colors/colors';

const MoreComponentSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder
        backgroundColor={colors.greyCream}
        highlightColor="#f2f2f2"
      >
        {/* Avatar placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.image} />
        </View>

        {/* Buttons placeholder */}
        <View style={styles.topButtonsContainer}>
          <View style={styles.button} />
          <View style={styles.button} />
        </View>

        {/* Fields placeholders */}
        {[...Array(6)].map((_, index) => (
          <View key={index} style={styles.fieldContainer}>
            <View style={styles.label} />
            <View style={styles.value} />
          </View>
        ))}

        {/* Button placeholder */}
        <View style={styles.largeButton} />
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    height: 50,
    marginHorizontal: 10,
    width: 50,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  fieldContainer: {
    marginVertical: 10,
    width: '100%',
  },
  image: {
    borderRadius: 75,
    height: 150,
    width: 150,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    borderRadius: 4,
    height: 15,
    marginBottom: 8,
    width: '30%',
  },
  largeButton: {
    borderRadius: 25,
    height: 50,
    marginTop: 20,
    width: '80%',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  value: {
    borderRadius: 4,
    height: 20,
    width: '80%',
  },
});

export default MoreComponentSkeleton;
