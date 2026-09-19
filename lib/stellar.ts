export type Network = 'TESTNET' | 'PUBLIC';

export const NETWORKS = {
  TESTNET: {
    name: 'Testnet',
    passphrase: 'Test SDF Network ; September 2015',
    horizon: 'https://horizon-testnet.stellar.org',
    soroban: 'https://soroban-testnet.stellar.org',
    explorer: 'https://stellar.expert/explorer/testnet',
  },
  PUBLIC: {
    name: 'Mainnet',
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizon: 'https://horizon.stellar.org',
    soroban: 'https://mainnet.sorobanrpc.com',
    explorer: 'https://stellar.expert/explorer/public',
  },
} as const;

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export const STORAGE_KEYS = {
  ADDRESS: 'gamingos_wallet_address',
  NETWORK: 'gamingos_network',
  CONNECTED: 'gamingos_connected',
} as const;
