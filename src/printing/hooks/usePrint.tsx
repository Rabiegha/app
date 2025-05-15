import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PRINT_URL } from '../../config/config';

// Define types for the printer and state
interface WiFiPrinter {
  addresses: string[];
  protocol: string;
  port: number;
}

interface PrintersState {
  selectedWiFiPrinter: WiFiPrinter[];
}

interface RootState {
  printers: PrintersState;
}

interface PrintDocument {
  [key: string]: unknown;
}

interface PrintResponse {
  success: boolean;
  message?: string;
}

interface UsePrintHook {
  handlePrint: (document: PrintDocument) => Promise<void>;
}

const usePrint = (): UsePrintHook => {
  const dispatch = useDispatch();
  const [printerIp, setPrinterIp] = useState<string | undefined>();
  const [protocol, setProtocol] = useState<string | undefined>();
  const selectedWiFiPrinter = useSelector<RootState, WiFiPrinter[]>(
    (state) => state.printers.selectedWiFiPrinter,
  );

  // Get the first selected printer
  const selectedPrinter =
  selectedWiFiPrinter.length > 0 ? selectedWiFiPrinter[0] : null;

  useEffect(() => {
    if (selectedPrinter) {
      console.log('Setting printer IP and protocol');
/*       setPrinterIp(selectedWiFiPrinter.addresses[0]);
      setProtocol(selectedWiFiPrinter.protocol); */
    }
  }, [selectedPrinter]); // Dependency on selectedPrinter

  const handlePrint = async (document: PrintDocument): Promise<void> => {
    if (!selectedPrinter) {
      console.error('No printer selected');
      return;
    }

    try {
      const result = await fetch(`${PRINT_URL}/print`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          printer: {
            addresses: selectedPrinter.addresses, // Printer IP address
            protocol: selectedPrinter.protocol, // Printer protocol (e.g., raw, lpr)
            port: selectedPrinter.port, // Printer port (e.g., 515 for LPR)
          },
          document: document, // The document as base64 string
        }),
      });

      const responseJson: PrintResponse = await result.json();
      if (responseJson.success) {
        console.log('Success', 'Print job sent successfully');
      } else {
        console.log('Error', responseJson.message);
      }
    } catch (error: unknown) {
      console.error('Error sending print job:', error);
    }
  };

  return {handlePrint};
};

export default usePrint;
