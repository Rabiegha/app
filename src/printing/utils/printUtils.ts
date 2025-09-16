/**
 * Utility functions for printing
 */
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';

/**
 * Create a delay using a promise
 * @param ms - Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Convert ArrayBuffer to base64 string
 * @param buffer - The ArrayBuffer to convert
 * @returns Base64 string representation
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return Buffer.from(buffer).toString('base64');
};

/**
 * Clean base64 string to ensure proper formatting
 * @param base64 - The base64 string to clean
 * @returns Cleaned base64 string
 */
export const cleanBase64 = (base64: string): string => {
  return Buffer.from(Buffer.from(base64, 'base64')).toString('base64');
};

/**
 * Fetch a document and convert it to base64
 * @param url - URL of the document to fetch
 * @param onError - Error callback function
 * @returns Promise resolving to base64 string
 */
export const fetchDocumentAsBase64 = async (
  url: string, 
  onError?: (status: string, message: string) => void
): Promise<string> => {
  if (url.startsWith('file://')) {
    const localPath = url.replace('file://', '');
    return await RNFS.readFile(localPath, 'base64');
  }

  try {
    // Add cache-busting headers and timestamp to prevent caching issues
    const cacheBustUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`;
    const response = await fetch(cacheBustUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (!response.ok) {
      throw new Error(`Échec de récupération du document: ${response.statusText}`);
    }
    const buffer = await response.arrayBuffer();
    return arrayBufferToBase64(buffer);
  } catch (fetchErr: unknown) {
    if (onError) {
      onError('fetch_failed', 
        fetchErr instanceof Error ? 
          fetchErr.message : 
          'Erreur réseau lors de la récupération du PDF.'
      );
    }
    throw new Error(
      fetchErr instanceof Error ? 
        fetchErr.message : 
        'Erreur réseau lors de la récupération du PDF.'
    );
  }
};

/**
 * Logger utility that only logs in development mode
 */
export const logger = {
  log: (...args: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  error: (...args: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(...args);
    }
  }
};
