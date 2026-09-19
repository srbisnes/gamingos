'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetworkDetails,
} from '@stellar/freighter-api';
import {
  Wallet,
  ChevronDown,
  LogOut,
  ExternalLink,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  NETWORKS,
  Network,
  truncateAddress,
  formatXlm,
  STORAGE_KEYS,
} from '@/lib/stellar';

type WalletMode = 'freighter' | 'managed';

export default function WalletConnect() {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>('TESTNET');
  const [mode, setMode] = useState<WalletMode>('managed');
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successSteps, setSuccessSteps] = useState<string[]>([]);

  // Restore session
  useEffect(() => {
    const savedAddress = localStorage.getItem(STORAGE_KEYS.ADDRESS);
    const savedNetwork = localStorage.getItem(STORAGE_KEYS.NETWORK) as Network | null;
    const wasConnected = localStorage.getItem(STORAGE_KEYS.CONNECTED) === 'true';
    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE) as WalletMode | null;

    if (savedNetwork) setNetwork(savedNetwork);
    if (savedMode) setMode(savedMode);

    if (wasConnected && savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  // Fetch balance
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
      const netParam = net === 'PUBLIC' ? 'public' : 'testnet';
      const res = await fetch(
        `/api/wallet/balance?publicKey=${encodeURIComponent(addr)}&network=${netParam}`
      );
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance ?? '0');
      } else {
        setBalance(null);
      }
    } catch {
      setBalance(null);
    } finally {
      setIsBalanceLoading(false);
    }
  };

  /** Create / restore managed Testnet wallet via API */
  const connectManaged = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setShowSuccess(false);
    setSuccessSteps([]);

    try {
      const existing = localStorage.getItem(STORAGE_KEYS.ADDRESS);
      const res = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: existing || undefined }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'No se pudo crear la wallet');
      }

      const steps: string[] = [];
      if (!data.existing) {
        steps.push('✅ Wallet Stellar creada');
      } else {
        steps.push('✅ Wallet Stellar recuperada');
      }
      if (data.funded) {
        steps.push('✅ Cuenta fondeada en Testnet');
      } else {
        steps.push('⚠️ Fondeo pendiente (reintentá Airdrop)');
      }
      steps.push('✅ Lista para operar');
      setSuccessSteps(steps);
      setShowSuccess(true);

      // Persist session
      setAddress(data.publicKey);
      setNetwork('TESTNET');
      setMode('managed');
      localStorage.setItem(STORAGE_KEYS.ADDRESS, data.publicKey);
      localStorage.setItem(STORAGE_KEYS.NETWORK, 'TESTNET');
      localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true');
      localStorage.setItem(STORAGE_KEYS.MODE, 'managed');
      localStorage.setItem(STORAGE_KEYS.SECRET_HINT, 'true');

      // If secret was returned (first time), keep a local backup flag only
      // (we intentionally do NOT store the raw secret in localStorage long-term)
      if (data.secretKey) {
        // One-time: user can copy from success UI if we show it — for security we don't persist it
        sessionStorage.setItem('gamingos_temp_secret', data.secretKey);
      }

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error al crear wallet Testnet');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Connect external Freighter wallet */
  const connectFreighter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await requestAccess();
      if (result.error) {
        setError(result.error || 'No se pudo conectar Freighter');
        return;
      }
      const addr = result.address;
      if (!addr) {
        setError('No se obtuvo la dirección');
        return;
      }

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
      setMode('freighter');
      localStorage.setItem(STORAGE_KEYS.ADDRESS, addr);
      localStorage.setItem(STORAGE_KEYS.CONNECTED, 'true');
      localStorage.setItem(STORAGE_KEYS.MODE, 'freighter');
    } catch (err: any) {
      setError(
        err?.message?.toLowerCase()?.includes('freighter')
          ? 'Instalá Freighter Wallet para continuar'
          : 'Error al conectar Freighter'
      );
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }, []);

  const airdrop = async () => {
    if (!address) return;
    setIsBalanceLoading(true);
    try {
      const res = await fetch('/api/wallet/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: address }),
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance ?? null);
        await fetchBalance(address, 'TESTNET');
      } else {
        setError(data.error || 'Airdrop falló');
      }
    } catch {
      setError('Error al solicitar airdrop');
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance(null);
    setShowSuccess(false);
    localStorage.removeItem(STORAGE_KEYS.ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.CONNECTED);
    localStorage.removeItem(STORAGE_KEYS.MODE);
    sessionStorage.removeItem('gamingos_temp_secret');
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
        <div className="flex items-center gap-2">
          <button
            onClick={connectManaged}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-sm font-medium transition disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isLoading ? 'Creando wallet...' : 'Conectar Stellar'}
          </button>
        </div>

        {/* Success toast */}
        {showSuccess && (
          <div className="absolute top-full right-0 mt-3 w-72 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-xl z-50">
            <div className="space-y-2">
              {successSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{step.replace(/^✅\s*/, '').replace(/^⚠️\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-full right-0 mt-2 w-72 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs z-50">
            {error}
            <button
              onClick={connectFreighter}
              className="block mt-2 underline hover:text-red-300"
            >
              Usar Freighter en su lugar →
            </button>
          </div>
        )}
      </div>
    );
  }

  // Connected
  return (
    <div className="relative">
      {showSuccess && (
        <div className="absolute top-full right-0 mt-3 w-72 p-4 rounded-xl bg-slate-900 border border-emerald-500/30 shadow-xl z-50">
          <div className="space-y-2">
            {successSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{step.replace(/^✅\s*/, '').replace(/^⚠️\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
            {/* Balance */}
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-slate-500">Balance</div>
                <button
                  onClick={() => address && fetchBalance(address, network)}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
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
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>{NETWORKS[network].name}</span>
                <span>·</span>
                <span className="capitalize">{mode === 'managed' ? 'GamingOS Wallet' : 'Freighter'}</span>
              </div>

              {mode === 'managed' && network === 'TESTNET' && (
                <button
                  onClick={airdrop}
                  disabled={isBalanceLoading}
                  className="mt-3 w-full py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-medium transition"
                >
                  Solicitar XLM (Friendbot)
                </button>
              )}
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

            {/* Network */}
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
            </div>

            {/* Alt connect Freighter */}
            {mode === 'managed' && (
              <button
                onClick={connectFreighter}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-400 hover:bg-slate-800 transition border-b border-slate-800"
              >
                <Wallet className="w-4 h-4" />
                Usar Freighter
              </button>
            )}

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
