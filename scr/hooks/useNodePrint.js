// src/hooks/usePrint.js
import useState from 'react';
import {sendPrintJob as sendPrintService} from '../services/serviceApi'; // Import the print service
import {useDispatch, useSelector} from 'react-redux';
import {setPrintStatus} from '../redux/slices/printerSlice';
import {
  selectOrientation,
  selectDpi,
  selectAutoPrint,
  selectPaperFormat,
  selectSelectedNodePrinter,
} from '../redux/selectors/printerSelectors';

export const useNodePrint = () => {
  //selectors
  const orientation = useSelector(selectOrientation);
  const dpi = useSelector(selectDpi);
  const selectedPaperFormat = useSelector(selectPaperFormat);

  // selectedNodePrinter
  const selectedNodePrinter = useSelector(selectSelectedNodePrinter);

  //
  const dispatch = useDispatch();
  // selectedWiFiPrinters
  const selectedWiFiPrinters = useSelector(
    state => state.printers.selectedWiFiPrinter,
  );

  const nodePrinterId = selectedNodePrinter?.id;

  const sendPrintJob = async fileBase64 => {
    if (!nodePrinterId) {
      dispatch(setPrintStatus('No printer selected'));
      return;
    }

    console.log('Selected paper format:', selectedPaperFormat);

    try {
      const printJob = {
        printerId: nodePrinterId,
        title: 'Print Job From Attendee',
        contentType: 'pdf_base64',
        content: fileBase64,
        source: 'Attendee App',
        options: {
          paper: selectedPaperFormat,
          copies: 1,
          color: true,
          dpi: dpi.toString(),
          orientation: orientation,
        },
      };

      const result = await sendPrintService(printJob);
      console.log("Résultat du travail d'impression :", result);
      dispatch(setPrintStatus('Print successful'));
    } catch (error) {
      dispatch(setPrintStatus('Print failed'));
      console.error(
        "Erreur lors de l'envoi du travail d'impression :",
        error.response ? error.response.data : error.message,
      );
      console.error("Erreur lors de l'envoi du travail d'impression :", error);
      throw error;
    }
  };

  return {
    sendPrintJob,
  };
};
