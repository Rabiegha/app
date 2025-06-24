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
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    borderRadius: 75,
    height: 150,
    width: 150,
  },
  topButtonsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  fieldContainer: {
    width: '100%',
    marginVertical: 10,
  },
  label: {
    height: 15,
    width: '30%',
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    height: 20,
    width: '80%',
    borderRadius: 4,
  },
  largeButton: {
    height: 50,
    width: '80%',
    borderRadius: 25,
    marginTop: 20,
  },
});

export default MoreComponentSkeleton;
