import { NextRequest, NextResponse } from 'next/server';
import { Horizon } from '@stellar/stellar-sdk';
import { NETWORKS } from '@/lib/stellar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const publicKey = body?.publicKey as string | undefined;

    if (!publicKey || !publicKey.startsWith('G')) {
      return NextResponse.json(
        { success: false, error: 'Valid publicKey is required' },
        { status: 400 }
      );
    }

    // Friendbot only works on Testnet
    const res = await fetch(
      `${NETWORKS.TESTNET.friendbot}?addr=${encodeURIComponent(publicKey)}`
    );

    const text = await res.text();
    let funded = res.ok;

    if (!res.ok) {
      // Already funded is OK
      if (text.includes('op_already_exists') || res.status === 400) {
        funded = true;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: 'Friendbot funding failed',
            details: text.slice(0, 300),
          },
          { status: 502 }
        );
      }
    }

    // Verify balance
    let balance = '0';
    try {
      const server = new Horizon.Server(NETWORKS.TESTNET.horizon);
      // wait a moment for horizon to index
      await new Promise((r) => setTimeout(r, 1000));
      const account = await server.loadAccount(publicKey);
      const native = account.balances.find((b) => b.asset_type === 'native') as
        | Horizon.Horizon.BalanceLineNative
        | undefined;
      balance = native?.balance ?? '0';
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      publicKey,
      network: 'testnet',
      funded,
      balance,
    });
  } catch (err: any) {
    console.error('POST /api/wallet/airdrop error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Airdrop failed' },
      { status: 500 }
    );
  }
}
