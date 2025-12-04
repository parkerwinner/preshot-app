import { defineChain } from 'viem';

export const campTestnet = defineChain({
  id: 325000,
  name: 'Camp Network Testnet',
  network: 'camp-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CAMP',
    symbol: 'CAMP',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.camp.network/'],
    },
    public: {
      http: ['https://testnet-rpc.camp.network/'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Camp Network Explorer', 
      url: 'https://camp-network-testnet.blockscout.com' 
    },
  },
  testnet: true,
});
