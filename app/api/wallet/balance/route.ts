import { NextRequest, NextResponse } from 'next/server';
import { Horizon } from '@stellar/stellar-sdk';
import { NETWORKS } from '@/lib/stellar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicKey = searchParams.get('publicKey');
    const network = (searchParams.get('network') || 'testnet').toLowerCase();

    if (!publicKey || !publicKey.startsWith('G')) {
      return NextResponse.json(
        { success: false, error: 'Valid publicKey is required' },
        { status: 400 }
      );
    }

    const horizonUrl =
      network === 'public' ? NETWORKS.PUBLIC.horizon : NETWORKS.TESTNET.horizon;

    const server = new Horizon.Server(horizonUrl);

    try {
      const account = await server.loadAccount(publicKey);
      const native = account.balances.find((b) => b.asset_type === 'native') as
        | Horizon.Horizon.BalanceLineNative
        | undefined;

      return NextResponse.json({
        success: true,
        publicKey,
        network: network === 'public' ? 'public' : 'testnet',
        balance: native?.balance ?? '0',
        balances: account.balances,
      });
    } catch (err: any) {
      if (err?.response?.status === 404) {
        return NextResponse.json({
          success: true,
          publicKey,
          network: network === 'public' ? 'public' : 'testnet',
          balance: '0',
          balances: [],
          note: 'Account not found on network (not funded yet)',
        });
      }
      throw err;
    }
  } catch (err: any) {
    console.error('GET /api/wallet/balance error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
