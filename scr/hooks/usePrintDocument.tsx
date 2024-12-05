// src/hooks/usePrintDocument.js

import {useCallback} from 'react';
import {Alert} from 'react-native';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import {setPrintStatus} from '../redux/slices/printerSlice';
import {useNodePrint} from './useNodePrint';
import {useEvent} from '../context/EventContext';

const usePrintDocument = () => {
  const eventDetails = useEvent();
  const dispatch = useDispatch();
  const {sendPrintJob} = useNodePrint();

  // Sélecteur Redux pour récupérer le Node Printer
  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );

  const nodePrinterId = selectedNodePrinter?.id;


  const eventId = eventDetails.eventId;

  // Fonction pour convertir ArrayBuffer en Base64
  const arrayBufferToBase64 = buffer => {
    return Buffer.from(buffer).toString('base64');
  };

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  const printDocument = useCallback(
    async attendeeId => {
      const documentUrl = `https://ems.choyou.fr/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;

      try {
        //check if the printer is selected
        if (!nodePrinterId) {
          console.error('No printer selected.');
          dispatch(setPrintStatus('No printer selected'));
          /*         Alert.alert('Error', 'Please select a printer before printing.'); */
          return;
        }

        //check if the file existes

        const headResponse = await fetch(documentUrl, {method: 'HEAD'});
        if (!headResponse.ok) {
          console.error('File does not exist.');
          dispatch(setPrintStatus('No file exists'));
          return;
        }

        // **Update print status to 'Sending print job'**
        dispatch(setPrintStatus('Sending print job'));

        // **Fetch and encode the document**

        let base64String = '';
        if (documentUrl.startsWith('file://')) {
          // Si le document est local
          console.log('Reading file from local path:', documentUrl);
          const localFilePath = documentUrl.replace('file://', '');
          base64String = await RNFS.readFile(localFilePath, 'base64');
          console.log('Local file encoded to Base64');
        } else {
          // Si le fichier est en ligne
          console.log('Fetching document from URL:', documentUrl);
          const response = await fetch(documentUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch document: ${response.statusText}`);
          }
          const arrayBuffer = await response.arrayBuffer();
          base64String = arrayBufferToBase64(arrayBuffer);
          console.log('Online file encoded to Base64');
        }
        // Envoyer le document à l'imprimante via useNodePrint
        await sendPrintJob(base64String);

        dispatch(setPrintStatus('Job completed, finalizing...'));

        console.log('Document sent to printer successfully!');

        await delay(2000);
        dispatch(setPrintStatus('Print successful'));
        /*         Alert.alert('Success', 'Document sent to the printer successfully!'); */
      } catch (error) {
        console.error(
          'Error printing document:',
          error.response ? error.response.data : error.message,
        );
        dispatch(setPrintStatus('Error printing document'));
        throw error;
      }
    },
    [eventId, nodePrinterId, sendPrintJob, dispatch],
  );

  return {printDocument};
};

export default usePrintDocument;
