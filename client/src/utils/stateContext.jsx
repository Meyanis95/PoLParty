import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export default function ContextProvider({ children }) {
  const [address, setAddress] = useState(null);

  return (
    <AppContext.Provider
      value={{
        address,
        setAddress
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
