import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { campTestnet } from './campChain';

// Get WalletConnect project ID from env
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const wagmiConfig = getDefaultConfig({
  appName: 'Preshot App',
  projectId,
  chains: [campTestnet],
  ssr: false, // We're using Vite, not SSR
});
