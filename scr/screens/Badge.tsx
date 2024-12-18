import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import HeaderComponent from '../components/elements/header/HeaderComponent';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import RNPrint from 'react-native-print';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BadgeComponent from '../components/screens/BadgeComponent';
import colors from '../assets/colors/colors';
import globalStyle from '../assets/styles/globalStyle';
import { useEvent } from '../context/EventContext';
import { EMS_URL } from '../config/config';

const BadgeScreen = ({route, navigation}) => {
  const {triggerListRefresh} = useEvent();

  const {eventId, attendeeId, firstName, lastName} = route.params;
  console.log('MoreScreen route.params:', route.params);

  const {itemName} = route.params || {};
  const handleBackPress = () => {
    navigation.goBack();
  };

  const image = `${EMS_URL}/uploads/badges/${eventId}/${attendeeId}.jpg`;

  const pdf = `https://ems.choyou.fr/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;
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
  const printPdf = async () => {
    const pdfUrl = `${EMS_URL}/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;
    try {
      await RNPrint.print({filePath: pdfUrl});
    } catch (error) {
      console.error('Error printing PDF:', error);
    }
  };
  const downloadPdf = async () => {
    // Define the URL of the PDF
    const pdfUrl = `${EMS_URL}/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;
    // Define the local file path where the PDF should be saved
    let dirs = RNFetchBlob.fs.dirs;
    const filePath = `${dirs.DownloadDir}/${firstName}_${lastName}_${attendeeId}.pdf`;

    try {
      const res = await RNFetchBlob.config({
        // Add Android permissions and path configuration
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: filePath,
          description: 'Downloading badge',
        },
      }).fetch('GET', pdfUrl);

      // Optionally, you can open the PDF after downloading
      if (Platform.OS === 'ios') {
        RNFetchBlob.ios.previewDocument(res.data);
      }

      //console.log('The file has been downloaded to:', filePath);
      Alert.alert(
        'Download Complete',
        'The file has been downloaded successfully.',
      );
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Error', 'There was an error downloading the file.');
    }
  };

  return (
    <View style={globalStyle.backgroundWhite}>
      <HeaderComponent
        title={''}
        handlePress={handleBackPress}
        color={colors.green}
      />
      <View style={globalStyle.container}>
        <BadgeComponent
          imageUri={image}
          share={sendPdf}
          download={downloadPdf}
          print={printPdf}
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
