import { useCallback, useState } from 'react';
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import { useNodePrint } from './useNodePrint';
import { usePrintStatus } from '../../printing/context/PrintStatusContext';

const usePrintDocument = () => {
  const { sendPrintJob } = useNodePrint();
  const selectedNodePrinter = useSelector((state: any) => state.printers.selectedNodePrinter);
  const nodePrinterId = selectedNodePrinter?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { status: printStatus, setStatus, clearStatus } = usePrintStatus();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    return Buffer.from(buffer).toString('base64');
  };

  const printDocument = useCallback(async (documentUrl: string) => {
    setLoading(true);
    setError(null);
    setMessage('');
    setSuccess(false);
    setStatus('printing');

    try {
      if (!nodePrinterId) {
        await delay(1000);
        setStatus('no_printer');
        throw new Error('Aucune imprimante sélectionnée.');
      }

      const headResponse = await fetch(documentUrl, { method: 'HEAD' });
      if (!headResponse.ok) {
        await delay(1000);
        setStatus('file_not_found');
        throw new Error('Fichier introuvable ou inaccessible.');
      }

      let base64String = '';

      if (documentUrl.startsWith('file://')) {
        const localFilePath = documentUrl.replace('file://', '');
        base64String = await RNFS.readFile(localFilePath, 'base64');
      } else {
        const response = await fetch(documentUrl);
        if (!response.ok) {
          await delay(1000);
          setStatus('fetch_failed');
          throw new Error(`Échec de récupération du document: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        base64String = arrayBufferToBase64(arrayBuffer);
      }

      const pdfBytes = Buffer.from(base64String, 'base64');
      const cleanedBase64 = Buffer.from(pdfBytes).toString('base64');

      await sendPrintJob(cleanedBase64);

      await delay(1000); // Let printing animation play
      setSuccess(true);
      setStatus('success');
      setMessage('Document imprimé avec succès.');
    } catch (err: any) {
      const msg = err?.message || 'Erreur inconnue lors de l’impression.';
      console.error('[printDocument] error:', msg);
      setError(msg);
      setMessage(msg);

      // 🛡️ Set fallback error status only if none of the above was triggered
      setTimeout(() => {
        setStatus(prev =>
          ['printing', null].includes(prev as string) ? 'unknown_error' : prev
        );
      }, 100);
    } finally {
      setLoading(false);
      setTimeout(() => {
        clearStatus();
      }, 3000); // Let animation be visible before hiding
    }
  }, [nodePrinterId, sendPrintJob, setStatus, clearStatus]);

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
