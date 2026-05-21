/**
 * Wallet Store — in-memory for MVP
 * TODO: migrate to Supabase/Neon for production
 */

import { WalletData } from "./wallet";

// In-memory store (keyed by Twitter user ID)
const walletStore = new Map<string, WalletData>();

export function storeWallet(userId: string, wallet: WalletData): void {
  walletStore.set(userId, wallet);
}

export function getWallet(userId: string): WalletData | null {
  return walletStore.get(userId) || null;
}

export function hasWallet(userId: string): boolean {
  return walletStore.has(userId);
}

export function getWalletCount(): number {
  return walletStore.size;
}
