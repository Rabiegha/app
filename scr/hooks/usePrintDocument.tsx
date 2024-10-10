// src/hooks/usePrintDocument.js

import {useCallback} from 'react';
import {Alert} from 'react-native';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {useDispatch, useSelector} from 'react-redux';
import {setPrintStatus} from '../redux/printerSlice';
import {useNodePrint} from './useNodePrint';
import {useEvent} from '../context/EventContext';

const usePrintDocument = attendeeId => {
  const {eventId} = useEvent();
  const dispatch = useDispatch();
  const {sendPrintJob} = useNodePrint();

  // Sélecteur Redux pour récupérer le Node Printer
  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );

  const nodePrinterId = selectedNodePrinter?.id;

  // Fonction pour convertir ArrayBuffer en Base64
  const arrayBufferToBase64 = buffer => {
    return Buffer.from(buffer).toString('base64');
  };

  const printDocument = useCallback(
    async item => {
      const documentUrl = `https://ems.choyou.fr/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;

      if (!nodePrinterId) {
        console.error('No printer selected.');
        dispatch(setPrintStatus('No printer selected'));
        Alert.alert('Error', 'Please select a printer before printing.');
        return;
      }

      try {
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

        console.log('Document sent to printer successfully!');
        dispatch(setPrintStatus('Print successful'));
        Alert.alert('Success', 'Document sent to the printer successfully!');
      } catch (error) {
        console.error(
          'Error printing document:',
          error.response ? error.response.data : error.message,
        );
        dispatch(setPrintStatus('Error printing document'));
        Alert.alert(
          'Error',
          'There was an issue sending the document to the printer.',
        );
      }
    },
    [nodePrinterId, sendPrintJob, dispatch],
  );

  return {printDocument};
};

export default usePrintDocument;
