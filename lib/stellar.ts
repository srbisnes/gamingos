export type Network = 'TESTNET' | 'PUBLIC';

export const NETWORKS = {
  TESTNET: {
    name: 'Testnet',
    passphrase: 'Test SDF Network ; September 2015',
    horizon: 'https://horizon-testnet.stellar.org',
    soroban: 'https://soroban-testnet.stellar.org',
    explorer: 'https://stellar.expert/explorer/testnet',
    friendbot: 'https://friendbot.stellar.org',
  },
  PUBLIC: {
    name: 'Mainnet',
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizon: 'https://horizon.stellar.org',
    soroban: 'https://mainnet.sorobanrpc.com',
    explorer: 'https://stellar.expert/explorer/public',
    friendbot: null as string | null,
  },
} as const;

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatXlm(balance: string | number, decimals = 4): string {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

export const STORAGE_KEYS = {
  ADDRESS: 'gamingos_wallet_address',
  NETWORK: 'gamingos_network',
  CONNECTED: 'gamingos_connected',
  MODE: 'gamingos_wallet_mode', // 'freighter' | 'managed'
  SECRET_HINT: 'gamingos_has_managed_wallet',
} as const;
