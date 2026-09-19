'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetworkDetails,
} from '@stellar/freighter-api';
import { Wallet, ChevronDown, LogOut, ExternalLink, Loader2 } from 'lucide-react';
import { NETWORKS, Network, truncateAddress, STORAGE_KEYS } from '@/lib/stellar';

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>('TESTNET');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEYS.ADDRESS);
    const savedNetwork = localStorage.getItem(STORAGE_KEYS.NETWORK) as Network | null;
    const wasConnected = localStorage.getItem(STORAGE_KEYS.CONNECTED) === 'true';

    if (savedNetwork) setNetwork(savedNetwork);

    if (wasConnected && savedAddress) {
      // Try to silently re-connect
      checkConnection(savedAddress);
    }
  }, []);

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
      // If Freighter is not connected but we had a session, clear it
      if (fallbackAddress) {
        // Keep the address visible but mark as not live
        setAddress(fallbackAddress);
      }
    } catch {
      // Freighter not installed or not available
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

      // Optional: check network of the wallet
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
        // ignore network detection errors
      }

      setAddress(addr);
      localStorage.setItem(STORAGE_KEYS.ADDRESS, addr);
      localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true');
      localStorage.setItem(STORAGE_KEYS.NETWORK, network);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message?.includes('Freighter')
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
    localStorage.removeItem(STORAGE_KEYS.ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.CONNECTED);
    setIsOpen(false);
  };

  const switchNetwork = (net: Network) => {
    setNetwork(net);
    localStorage.setItem(STORAGE_KEYS.NETWORK, net);
    setIsOpen(false);
  };

  const explorerUrl = address
    ? `${NETWORKS[network].explorer}/account/${address}`
    : '#';

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
          <div className="absolute top-full right-0 mt-2 w-64 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
            <div className="mt-2">
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-red-300"
              >
                Descargar Freighter →
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition"
      >
        <div
          className={`w-2 h-2 rounded-full ${
            network === 'TESTNET' ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
        />
        <span className="font-mono text-slate-200">{truncateAddress(address)}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-xl z-50 overflow-hidden">
            {/* Address */}
            <div className="p-4 border-b border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Dirección conectada</div>
              <div className="font-mono text-sm text-slate-200 break-all">{address}</div>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-brand-400 hover:text-brand-300"
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    network === 'PUBLIC'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-transparent'
                  }`}
                >
                  Mainnet
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-2 px-1">
                Asegurate de que Freighter esté en la misma red.
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
