import React, { createContext, useContext, useState } from 'react';

const PrintStatusContext = createContext(null);

export const PrintStatusProvider = ({ children }) => {
  const [status, setStatus] = useState(null);

  const clearStatus = () => setStatus(null);

  return (
    <PrintStatusContext.Provider value={{ status, setStatus, clearStatus }}>
      {children}
    </PrintStatusContext.Provider>
  );
};

export const usePrintStatus = () => {
  return useContext(PrintStatusContext);
};
