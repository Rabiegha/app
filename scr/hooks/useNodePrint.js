// src/hooks/usePrint.js
import useState from 'react';
import {sendPrintJob as sendPrintService} from '../services/serviceApi'; // Import the print service
import {useDispatch, useSelector} from 'react-redux';
import {setPrintStatus} from '../redux/printerSlice';

export const useNodePrint = () => {
  const dispatch = useDispatch();
  // selectedWiFiPrinters
  const selectedWiFiPrinters = useSelector(
    state => state.printers.selectedWiFiPrinter,
  );

  // selectedNodePrinter
  const selectedNodePrinter = useSelector(
    state => state.printers.selectedNodePrinter,
  );

  const selectedPaperFormat = useSelector(
    state => state.printers.selectedOptions.paperFormat,
  );

  const nodePrinterId = selectedNodePrinter?.id; // Get printer ID and fileType from context

  const sendPrintJob = async fileBase64 => {
    if (!nodePrinterId) {
      dispatch(setPrintStatus('No printer selected'));
      return;
    }

    try {
      const printJob = {
        printerId: nodePrinterId,
        title: 'Print Job From Attendee',
        printType: 'pdf_base64',
        fileBase64,
        options: {
          paper: selectedPaperFormat,
          copies: 1,
          color: true,
          dpi: 600,
          orientation: 'portrait',
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
