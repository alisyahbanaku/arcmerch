/**
 * Wallet API
 * GET  /api/wallet — get wallet info (address, created at)
 * POST /api/wallet/export — decrypt and export seed phrase
 *
 * Security: requires verified (Twitter OAuth) session for export.
 * CSRF: Origin header check on POST.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { decryptMnemonic } from "../../../lib/wallet";
import { getWallet } from "../../../lib/wallet-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = getWallet(session.user.id);
  if (!wallet) {
    return NextResponse.json({ error: "No wallet found" }, { status: 404 });
  }

  return NextResponse.json({
    address: wallet.address,
    createdAt: wallet.createdAt,
    verified: (session.user as any).verified || false,
  });
}

export async function POST(request: NextRequest) {
  // ── CSRF: Origin check ──────────────────────────────────────
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const allowedOrigins = [
    process.env.NEXTAUTH_URL || "http://localhost:3001",
    `https://${host}`,
    `http://${host}`,
  ];
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: "CSRF: invalid origin" }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Verified check: only Twitter OAuth users can export ────
  const verified = (session.user as any).verified;
  if (!verified) {
    return NextResponse.json(
      { error: "Only verified creators (Twitter OAuth) can export seed phrase. Please sign in with X." },
      { status: 403 }
    );
  }

  const wallet = getWallet(session.user.id);
  if (!wallet) {
    return NextResponse.json({ error: "No wallet found" }, { status: 404 });
  }

  try {
    const mnemonic = decryptMnemonic(wallet, session.user.id);
    return NextResponse.json({ mnemonic });
  } catch {
    return NextResponse.json(
      { error: "Failed to decrypt wallet" },
      { status: 500 }
    );
  }
}
