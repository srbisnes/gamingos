import { NextRequest, NextResponse } from 'next/server';
import { Keypair, Horizon } from '@stellar/stellar-sdk';
import { NETWORKS } from '@/lib/stellar';
import { encryptSecret } from '@/lib/crypto';
import { createId, findWalletByPublicKey, saveWallet } from '@/lib/wallet-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${NETWORKS.TESTNET.friendbot}?addr=${encodeURIComponent(publicKey)}`
    );
    if (!res.ok) {
      const text = await res.text();
      console.error('Friendbot error:', res.status, text);
      // Account may already be funded
      if (res.status === 400 && text.includes('op_already_exists')) {
        return true;
      }
      return false;
    }
    return true;
  } catch (err) {
    console.error('Friendbot request failed:', err);
    return false;
  }
}

async function accountExists(publicKey: string): Promise<boolean> {
  try {
    const server = new Horizon.Server(NETWORKS.TESTNET.horizon);
    await server.loadAccount(publicKey);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const existingPublicKey =
      typeof body?.publicKey === 'string' ? body.publicKey : null;

    // If client already has a public key registered, reuse it
    if (existingPublicKey) {
      const existing = findWalletByPublicKey(existingPublicKey);
      if (existing) {
        const funded = await accountExists(existingPublicKey);
        if (!funded) {
          await fundWithFriendbot(existingPublicKey);
        }
        return NextResponse.json({
          success: true,
          publicKey: existing.public_key,
          network: 'testnet',
          funded: true,
          existing: true,
        });
      }
    }

    // Generate new Testnet keypair
    const keypair = Keypair.random();
    const publicKey = keypair.publicKey();
    const secretKey = keypair.secret();

    // Encrypt secret before storing
    const encrypted_secret = encryptSecret(secretKey);

    const wallet = {
      id: createId(),
      public_key: publicKey,
      encrypted_secret,
      network: 'testnet' as const,
      created_at: new Date().toISOString(),
    };

    saveWallet(wallet);

    // Fund via Friendbot
    const funded = await fundWithFriendbot(publicKey);

    // Small delay + verify account exists on Horizon
    let verified = funded;
    if (funded) {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 800));
        if (await accountExists(publicKey)) {
          verified = true;
          break;
        }
      }
    }

    return NextResponse.json({
      success: true,
      publicKey,
      network: 'testnet',
      funded: verified,
      existing: false,
      // Secret is returned ONLY once on creation so the client can backup.
      // It is stored encrypted server-side and never returned again.
      secretKey: existingPublicKey ? undefined : secretKey,
    });
  } catch (err: any) {
    console.error('POST /api/wallet/create error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create wallet' },
      { status: 500 }
    );
  }
}
