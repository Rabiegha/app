import { useCallback, useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import { useNodePrint } from './useNodePrint';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';
import { store } from '../../redux/store';

const usePrintDocument = () => {
  const { sendPrintJob } = useNodePrint();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const { status: printStatus, setStatus, clearStatus } = usePrintStatus();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return Buffer.from(buffer).toString('base64');
  };

  const fetchDocumentAsBase64 = async (url: string): Promise<string> => {
    if (url.startsWith('file://')) {
      const localPath = url.replace('file://', '');
      return await RNFS.readFile(localPath, 'base64');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Échec de récupération du document: ${response.statusText}`);
      const buffer = await response.arrayBuffer();
      return arrayBufferToBase64(buffer);
    } catch (fetchErr: any) {
      setStatus('fetch_failed');
      throw new Error(fetchErr?.message || 'Erreur réseau lors de la récupération du PDF.');
    }
  };

  const printDocument = useCallback(async (documentUrl: string, printerId?: string, useStoreId: boolean = false) => {
    setLoading(true);
    setError(null);
    setMessage('');
    setSuccess(false);
    setStatus('printing');
    
    // Get printer ID from store if requested and not provided directly
    const effectivePrinterId = useStoreId ? 
      store.getState().printers.selectedNodePrinter?.id : 
      printerId;
      
    console.log('selected printer', effectivePrinterId)
    try {
      if (!effectivePrinterId) {
        setStatus('no_printer');
        throw new Error('Aucune imprimante sélectionnée.');
      }

      console.log('[printDocument] documentUrl:', documentUrl);
      const base64 = await fetchDocumentAsBase64(documentUrl);

      const cleanedBase64 = Buffer.from(Buffer.from(base64, 'base64')).toString('base64');

      await sendPrintJob(cleanedBase64, effectivePrinterId);

      await delay(1000);
      setSuccess(true);
      setStatus('success');
      setMessage('Document imprimé avec succès.');
    } catch (err: any) {
      await delay(1000);
      const msg = err?.message || 'Erreur inconnue lors de l’impression.';
      console.error('[printDocument] error:', msg);
      setError(msg);
      setMessage(msg);
      setTimeout(() => {
        setStatus(prev => {
          const knownErrors = [
            'no_printer',
            'file_not_found',
            'fetch_failed',
            'printing',
            'success',
          ];
          return knownErrors.includes(prev as string) ? prev : 'unknown_error';
        });
      }, 100);
    } finally {
      setLoading(false);
      setTimeout(() => clearStatus(), 3000); // Allow some time for user feedback
    }
  }, [sendPrintJob, setStatus, clearStatus]);

  return {
    printDocument,
    loading,
    error,
    message,
    success,
    printStatus,
  };
};

export default usePrintDocument;
