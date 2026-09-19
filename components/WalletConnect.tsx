'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetworkDetails,
} from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';
import {
  Wallet,
  ChevronDown,
  LogOut,
  ExternalLink,
  Loader2,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import {
  NETWORKS,
  Network,
  truncateAddress,
  formatXlm,
  STORAGE_KEYS,
} from '@/lib/stellar';

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>('TESTNET');
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEYS.ADDRESS);
    const savedNetwork = localStorage.getItem(STORAGE_KEYS.NETWORK) as Network | null;
    const wasConnected = localStorage.getItem(STORAGE_KEYS.CONNECTED) === 'true';

    if (savedNetwork) setNetwork(savedNetwork);

    if (wasConnected && savedAddress) {
      checkConnection(savedAddress);
    }
  }, []);

  // Fetch balance whenever address or network changes
  useEffect(() => {
    if (address) {
      fetchBalance(address, network);
    } else {
      setBalance(null);
    }
  }, [address, network]);

  const fetchBalance = async (addr: string, net: Network) => {
    setIsBalanceLoading(true);
    try {
      const server = new Horizon.Server(NETWORKS[net].horizon);
      const account = await server.loadAccount(addr);
      const xlm = account.balances.find(
        (b) => b.asset_type === 'native'
      ) as Horizon.Horizon.BalanceLineNative | undefined;

      setBalance(xlm?.balance ?? '0');
    } catch (err: any) {
      // Account may not exist yet (especially on testnet)
      if (err?.response?.status === 404) {
        setBalance('0');
      } else {
        console.error('Error fetching balance:', err);
        setBalance(null);
      }
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const checkConnection = async (fallbackAddress?: string) => {
    try {
      const connected = await isConnected();
      if (connected) {
        const { address: addr } = await getAddress();
        if (addr) {
          setAddress(addr);
          localStorage.setItem(STORAGE_KEYS.ADDRESS, addr);
          localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true');
          return;
        }
      }
      if (fallbackAddress) {
        setAddress(fallbackAddress);
      }
    } catch {
      // Freighter not available
    }
  };

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await requestAccess();
      if (result.error) {
        setError(result.error || 'No se pudo conectar la wallet');
        return;
      }
      const addr = result.address;
      if (!addr) {
        setError('No se obtuvo la dirección');
        return;
      }

      // Detect network from Freighter
      try {
        const details = await getNetworkDetails();
        if (details?.networkPassphrase) {
          const isTestnet =
            details.networkPassphrase === NETWORKS.TESTNET.passphrase;
          const detected: Network = isTestnet ? 'TESTNET' : 'PUBLIC';
          setNetwork(detected);
          localStorage.setItem(STORAGE_KEYS.NETWORK, detected);
        }
      } catch {
        // ignore
      }

      setAddress(addr);
      localStorage.setItem(STORAGE_KEYS.ADDRESS, addr);
      localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true');
      localStorage.setItem(STORAGE_KEYS.NETWORK, network);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message?.toLowerCase()?.includes('freighter') ||
          err?.message?.toLowerCase()?.includes('extension')
          ? 'Instalá Freighter Wallet para continuar'
          : 'Error al conectar la wallet'
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }, [network]);

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    localStorage.removeItem(STORAGE_KEYS.ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.CONNECTED);
    setIsOpen(false);
  };

  const switchNetwork = (net: Network) => {
    setNetwork(net);
    localStorage.setItem(STORAGE_KEYS.NETWORK, net);
  };

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const explorerUrl = address
    ? `${NETWORKS[network].explorer}/account/${address}`
    : '#';

  // Not connected
  if (!address) {
    return (
      <div className="relative">
        <button
          onClick={connect}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-sm font-medium transition disabled:opacity-60"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          {isLoading ? 'Conectando...' : 'Conectar Wallet'}
        </button>

        {error && (
          <div className="absolute top-full right-0 mt-2 w-72 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs z-50">
            {error}
            <div className="mt-2 space-y-1">
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block underline hover:text-red-300"
              >
                Descargar Freighter →
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Connected
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition"
      >
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${
            network === 'TESTNET' ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
        />
        <div className="flex flex-col items-start leading-tight">
          <span className="font-mono text-slate-200 text-xs">
            {truncateAddress(address)}
          </span>
          <span className="text-[11px] text-slate-400">
            {isBalanceLoading ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> cargando...
              </span>
            ) : balance !== null ? (
              `${formatXlm(balance)} XLM`
            ) : (
              '— XLM'
            )}
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 overflow-hidden">
            {/* Header with balance */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-slate-500">Balance</div>
                <button
                  onClick={() => address && fetchBalance(address, network)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                  title="Actualizar balance"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isBalanceLoading ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {isBalanceLoading ? (
                  <span className="text-slate-500 text-lg">Cargando...</span>
                ) : balance !== null ? (
                  <>
                    {formatXlm(balance)}{' '}
                    <span className="text-base font-medium text-slate-400">XLM</span>
                  </>
                ) : (
                  <span className="text-slate-500 text-lg">—</span>
                )}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {NETWORKS[network].name}
              </div>
            </div>

            {/* Address */}
            <div className="p-4 border-b border-slate-800">
              <div className="text-xs text-slate-500 mb-1.5">Dirección</div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xs text-slate-200 break-all flex-1">
                  {address}
                </div>
                <button
                  onClick={copyAddress}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition shrink-0"
                  title="Copiar"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2.5 text-xs text-brand-400 hover:text-brand-300"
              >
                Ver en Stellar Expert <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Network Switch */}
            <div className="p-3 border-b border-slate-800">
              <div className="text-xs text-slate-500 mb-2 px-1">Red</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => switchNetwork('TESTNET')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    network === 'TESTNET'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  Testnet
                </button>
                <button
                  onClick={() => switchNetwork('PUBLIC')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${\                    network === 'PUBLIC'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  Mainnet
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 px-1">
                Cambia también la red dentro de Freighter para que coincida.
              </p>
            </div>

            {/* Disconnect */}
            <button
              onClick={disconnect}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut className="w-4 h-4" />
              Desconectar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
