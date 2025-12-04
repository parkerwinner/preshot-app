// Thirdweb Provider for Preshot Platform
import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { base, baseSepolia } from 'thirdweb/chains';
import { ReactNode } from 'react';

const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;
const network = import.meta.env.VITE_BASE_NETWORK || 'base-sepolia';

if (!clientId) {
  console.warn('VITE_THIRDWEB_CLIENT_ID not found. Please set it in .env.local');
}

// Create Thirdweb client
export const client = createThirdwebClient({
  clientId: clientId || 'demo-client-id', // Fallback for development
});

// Get the correct chain based on environment
export const activeChain = network === 'base' ? base : baseSepolia;

interface PreshotThirdwebProviderProps {
  children: ReactNode;
}

export function PreshotThirdwebProvider({ children }: PreshotThirdwebProviderProps) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}
