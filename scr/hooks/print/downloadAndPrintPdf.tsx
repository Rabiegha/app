// hooks/print/downloadAndPrintPdf.js
import RNPrint from 'react-native-print';
import BlobUtil from '@react-native-oh-tpl/react-native-blob-util';
import {EMS_URL} from '../../config/config';

export const downloadAndPrintPdf = async (
  eventId,
  attendeeId,
  firstName,
  lastName
) => {
  try {
    // 1. Construct the remote URL
    const pdfUrl = `${EMS_URL}/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;

    // 2. Determine the local path
    const dirs = BlobUtil.fs.dirs;
    const filePath = `${dirs.DownloadDir}/${firstName}_${lastName}_${attendeeId}.pdf`;

    // 3. Download the PDF to local storage (especially needed on Android)
    const res = await BlobUtil.config({
      fileCache: true,
      path: filePath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: filePath,
        description: 'Downloading badge PDF',
      },
    }).fetch('GET', pdfUrl);

    // 4. Print from the local file path
    await RNPrint.print({filePath: res.path()});
  } catch (error) {
    console.error('Error downloading or printing PDF:', error);
  }
};
