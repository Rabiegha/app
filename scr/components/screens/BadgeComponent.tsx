import React, {useState} from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../../colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import emptyGif from '../../assets/images/empty.gif';
import downloadIcon from '../../assets/images/icons/Download.png';
import printIcon from '../../assets/images/icons/Print.png';

const BadgeComponent = ({imageUri, share, download, print}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageLoaded ? (
          <Image
            source={{uri: imageUri}}
            style={styles.image}
            onError={() => setImageLoaded(false)}
          />
        ) : (
          <View style={styles.noDataView}>
            <Image
              source={emptyGif}
              style={styles.gifStyle}
            />
          </View>
        )}
      </View>
      {imageLoaded && (
        <View style={styles.buttonsContainer}>
          <View style={styles.topButtonsContainer}>
            <SmallButton
              imageSource={downloadIcon}
              pressHandler={download}
              backgroundColor={colors.greyCream}
              tintColor={colors.darkGrey}
            />
            <SmallButton
              imageSource={printIcon}
              pressHandler={print}
              backgroundColor={colors.greyCream}
              tintColor={colors.darkGrey}
            />
          </View>
          <LargeButton
            title="Envoyer"
            onPress={share}
            backgroundColor={colors.green}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 30,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 380,
    borderRadius: 40,
  },
  imageNotFound: {
    fontSize: 18,
    color: colors.darkGrey,
    textAlign: 'center',
  },
  topButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    alignItems: 'center',
  },
  noDataView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gifStyle: {
    height: 300,
    width: 300,
  },
});

export default BadgeComponent;
