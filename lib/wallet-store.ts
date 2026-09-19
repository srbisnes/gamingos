/**
 * Simple wallet registry.
 *
 * Production: replace with Postgres / Prisma / Supabase.
 * Schema:
 *
 *   wallets
 *   - id            UUID / cuid
 *   - public_key    TEXT UNIQUE
 *   - encrypted_secret TEXT
 *   - network       TEXT ('testnet' | 'public')
 *   - created_at    TIMESTAMP
 */

export type StoredWallet = {
  id: string;
  public_key: string;
  encrypted_secret: string;
  network: 'testnet' | 'public';
  created_at: string;
};

// In-memory store (survives warm serverless instances; not durable across cold starts).
// For production durability, plug in a real database here.
const globalStore = globalThis as unknown as {
  __gamingos_wallets?: Map<string, StoredWallet>;
};

if (!globalStore.__gamingos_wallets) {
  globalStore.__gamingos_wallets = new Map();
}

const store = globalStore.__gamingos_wallets;

export function findWalletByPublicKey(publicKey: string): StoredWallet | undefined {
  return store.get(publicKey);
}

export function saveWallet(wallet: StoredWallet): void {
  store.set(wallet.public_key, wallet);
}

export function listWallets(): StoredWallet[] {
  return Array.from(store.values());
}

export function createId(): string {
  return `wlt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
