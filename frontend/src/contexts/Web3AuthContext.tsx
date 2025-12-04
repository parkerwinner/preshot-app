import React, { createContext, useContext, ReactNode } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

interface Web3AuthContextType {
  address: string | undefined;
  isConnected: boolean;
  isLoading: boolean;
  disconnect: () => void;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // wagmi handles loading state internally, we can add it if needed
  const isLoading = false;

  return (
    <Web3AuthContext.Provider
      value={{
        address,
        isConnected,
        isLoading,
        disconnect,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};
