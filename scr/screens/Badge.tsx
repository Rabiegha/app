import React from 'react';
import {View, Alert, StyleSheet, Platform} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import Share from 'react-native-share';
import BadgeComponent from '../components/screens/BadgeComponent';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import {useEvent} from '../context/EventContext';
import {EMS_URL} from '../config/config';
import BlobUtil from '@react-native-oh-tpl/react-native-blob-util';
import {downloadAndPrintPdf} from '../hooks/print/downloadAndPrintPdf';

const BadgeScreen = ({route, navigation}) => {
  const {triggerListRefresh} = useEvent();
  const {eventId, attendeeId, firstName, lastName, badgePdfUrl, badgeImageUrl} = route.params;
  console.log('MoreScreen route.params:', route.params);

  const image = badgeImageUrl;
  const pdf = badgePdfUrl;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const sendPdf = async () => {
    try {
      const shareResponse = await Share.open({
        url: pdf,
        type: 'application/pdf',
      });
      console.log(shareResponse);
    } catch (error) {
      console.error(error);
    }
  };



  /* const downloadPdf = async () => {
    const pdfUrl = `${EMS_URL}/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;
    let dirs = BlobUtil.fs.dirs;
    const filePath = `${dirs.DownloadDir}/${firstName}_${lastName}_${attendeeId}.pdf`;

    try {
      const res = await BlobUtil.config({
        fileCache: true,
        path: filePath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading badge',
        },
      }).fetch('GET', pdfUrl);

      if (Platform.OS === 'ios') {
        BlobUtil.ios.previewDocument(res.path());
      }

      Alert.alert(
        'Download Complete',
        'The file has been downloaded successfully.',
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Error', 'There was an error downloading the file.');
    }
  }; */

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={''}
        handlePress={handleBackPress}
        color={colors.green}
        backgroundColor={undefined}
      />
      <View style={globalStyle.container}>
        <BadgeComponent
          imageUri={image}
          share={sendPdf} download={undefined} print={undefined}/*           print={printPdf} */
/*           download={downloadPdf} */
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemName: {
    fontSize: 18,
    top: 50,
  },
});

export default BadgeScreen;
