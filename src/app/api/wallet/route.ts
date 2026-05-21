/**
 * Wallet API
 * GET  /api/wallet — get wallet info (address, created at)
 * POST /api/wallet/export — decrypt and export seed phrase
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWallet } from "@/lib/wallet-store";
import { decryptMnemonic } from "@/lib/wallet";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const wallet = getWallet(userId);

  if (!wallet) {
    return NextResponse.json({ error: "No wallet found" }, { status: 404 });
  }

  return NextResponse.json({
    address: wallet.address,
    createdAt: wallet.createdAt,
    twitterHandle: (session.user as any).twitterHandle,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const wallet = getWallet(userId);

  if (!wallet) {
    return NextResponse.json({ error: "No wallet found" }, { status: 404 });
  }

  try {
    const sessionToken = (session as any).jti || userId;
    const mnemonic = decryptMnemonic(wallet, userId, sessionToken);

    return NextResponse.json({
      mnemonic,
      address: wallet.address,
      warning: "Keep this phrase secret. Anyone with this phrase can access your wallet.",
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to decrypt wallet" }, { status: 500 });
  }
}
