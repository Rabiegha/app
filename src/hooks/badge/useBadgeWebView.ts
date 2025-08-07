import { useState } from 'react';

interface WebViewState {
  isLoading: boolean;
  hasError: boolean;
  webViewError: string | null;
}

interface WebViewActions {
  handleWebViewLoad: () => void;
  handleWebViewError: (error: any) => void;
  handleRetry: () => void;
  resetState: () => void;
}

export const useBadgeWebView = (): WebViewState & WebViewActions => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [webViewError, setWebViewError] = useState<string | null>(null);

  const handleWebViewLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setWebViewError(null);
  };

  const handleWebViewError = (error: any) => {
    setIsLoading(false);
    setHasError(true);
    setWebViewError(error.description || 'Erreur de chargement du badge');
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setWebViewError(null);
  };

  const resetState = () => {
    setIsLoading(true);
    setHasError(false);
    setWebViewError(null);
  };

  return {
    isLoading,
    hasError,
    webViewError,
    handleWebViewLoad,
    handleWebViewError,
    handleRetry,
    resetState,
  };
};
