// src/hooks/usePrintDocument.js

import {useCallback} from 'react';
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

  const printDocument = useCallback(
    async attendeeId => {
      const documentUrl = `https://ems.choyou.fr/uploads/badges/${eventId}/pdf/${attendeeId}.pdf`;

      try {
        // Vérifier si l'imprimante est sélectionnée
        if (!nodePrinterId) {
          console.error('No printer selected.');
          dispatch(setPrintStatus('Error printing'));
          return;
        }

        // Vérifier si le fichier existe
        const headResponse = await fetch(documentUrl, {method: 'HEAD'});
        if (!headResponse.ok) {
          console.error('File does not exist.');
          dispatch(setPrintStatus('Error printing'));
          return;
        }

        // Mettre à jour le statut d'impression à 'Sending print job'
        dispatch(setPrintStatus('Sending print job'));

        // Récupérer et encoder le document
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
            console.error(`Failed to fetch document: ${response.statusText}`);
            dispatch(setPrintStatus('Error printing'));
            return;
          }
          const arrayBuffer = await response.arrayBuffer();
          base64String = arrayBufferToBase64(arrayBuffer);
          console.log('Online file encoded to Base64');
        }

        // Envoyer le document à l'imprimante via useNodePrint
        await sendPrintJob(base64String);

        dispatch(setPrintStatus('Print successful'));
      } catch (error) {
        console.error(
          'Error printing document:',
          error.response ? error.response.data : error.message,
        );
        dispatch(setPrintStatus('Error printing'));
        // Ne pas relancer l'erreur pour éviter les rejets non gérés
      }
    },
    [eventId, nodePrinterId, sendPrintJob, dispatch],
  );

  return {printDocument};
};

export default usePrintDocument;
