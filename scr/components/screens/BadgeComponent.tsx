import React, {useState} from 'react';
import {StyleSheet, Image, View, Text} from 'react-native';
import LargeButton from '../elements/buttons/LargeButton';
import colors from '../../assets/colors/colors';
import SmallButton from '../elements/buttons/SmallButton';
import emptyGif from '../../assets/images/empty.gif';
import downloadIcon from '../../assets/images/icons/Download.png';
import printIcon from '../../assets/images/icons/Print.png';
import Gif from 'react-native-gif';
import EmptyView from '../elements/view/EmptyView';
import emptyAnimation from '../../assets/animations/Empty.json';
import LottieView from 'lottie-react-native';

const BadgeComponent = ({imageUri, share, download, print}) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {false ? (
          <Image
            source={{uri: imageUri}}
            style={styles.image}
            onError={() => setImageLoaded(false)}
          />
        ) : (
          <View style={styles.noDataView}>
            <LottieView
        source={emptyAnimation}
        autoPlay
        loop={true}
        style={styles.gifStyle}
      />
          </View>
        )}
      </View>
{/*       {imageLoaded && (
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
        </View>
      )} */}
{/*       <LargeButton
        title="Envoyer"
        onPress={share}
        backgroundColor={colors.green}
        loading={undefined}
      /> */}
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
    alignItems: 'center',
  },
  image: {
    width: 190,
    height: 500,
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
    height: 400,
    width: 400,
  },
});

export default BadgeComponent;
