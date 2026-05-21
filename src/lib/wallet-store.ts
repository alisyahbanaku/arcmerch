/**
 * Wallet Store — persisted to JSON file
 * Production: migrate to Supabase/Postgres
 */

import { WalletData } from "./wallet";
import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), ".wallet-store.json");

// In-memory cache (loaded from file on first access)
let store: Map<string, WalletData> | null = null;

function loadStore(): Map<string, WalletData> {
  if (store) return store;
  store = new Map();
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
      for (const [key, value] of Object.entries(data)) {
        store.set(key, value as WalletData);
      }
    }
  } catch {
    // Corrupted file — start fresh
  }
  return store;
}

function persistStore(): void {
  if (!store) return;
  const obj: Record<string, WalletData> = {};
  for (const [key, value] of store.entries()) {
    obj[key] = value;
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(obj, null, 2));
}

export function storeWallet(userId: string, wallet: WalletData): void {
  loadStore().set(userId, wallet);
  persistStore();
}

export function getWallet(userId: string): WalletData | undefined {
  return loadStore().get(userId);
}

export function hasWallet(userId: string): boolean {
  return loadStore().has(userId);
}
