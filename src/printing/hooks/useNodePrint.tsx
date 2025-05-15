/**
 * Hook for handling print jobs with PrintNode service
 */
import { useDispatch, useSelector } from 'react-redux';
import { sendPrintJob as sendPrintService } from '../../services/printNodeService';
import { setPrintStatus } from '../../redux/slices/printerSlice';
import {
  selectOrientation,
  selectDpi,
  selectPaperFormat,
} from '../../redux/selectors/print/printerSelectors';

// Define interfaces for type safety
interface PrintJobOptions {
  copies: number;
  color: boolean;
  dpi: string;
  orientation: string;
  pageRanges: string;
  pages: number;
  sizing: string;
}

interface PrintJob {
  printerId: string;
  title: string;
  contentType: string;
  content: string;
  source: string;
  options: PrintJobOptions;
}

/**
 * Hook for interacting with the PrintNode service
 * @returns Object containing the sendPrintJob function
 */
export const useNodePrint = () => {
  // Get printer settings from Redux store
  const orientation = useSelector(selectOrientation);
  const dpi = useSelector(selectDpi);
  const selectedPaperFormat = useSelector(selectPaperFormat);
  const dispatch = useDispatch();

  /**
   * Send a print job to the PrintNode service
   * @param fileBase64 - Base64 encoded file content
   * @param printerId - ID of the printer to use
   * @returns Promise that resolves when the print job is sent
   */
  const sendPrintJob = async (fileBase64: string, printerId: string): Promise<void> => {
    if (!printerId) {
      dispatch(setPrintStatus('No printer selected'));
      return;
    }

    console.log('Selected paper format:', selectedPaperFormat);

    try {
      const printJob: PrintJob = {
        printerId,
        title: 'Print Job From Attendee', // TODO: replace with attendee name + badge
        contentType: 'pdf_base64',
        content: fileBase64,
        source: 'Attendee App',
        options: {
          copies: 1,
          color: true,
          dpi: dpi.toString(),
          orientation,
          pageRanges: '1',
          pages: 1,
          sizing: 'none',
        },
      };

      const result = await sendPrintService(printJob);
      console.log("Résultat du travail d'impression :", result);
      dispatch(setPrintStatus('Print successful'));
    } catch (error: unknown) {
      dispatch(setPrintStatus('Print failed'));
      
      // Safely handle error object
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorResponse = error && typeof error === 'object' && 'response' in error ? 
        (error as any).response?.data : errorMessage;
      
      console.error("Erreur lors de l'envoi du travail d'impression :", errorResponse);
      throw error;
    }
  };

  return {
    sendPrintJob,
  };
};
