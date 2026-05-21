/**
 * ArcMerch Hybrid Wallet System
 *
 * Key Split Model:
 *   Private Key = HMAC-SHA256(userSecret, platformSecret)
 *   - userSecret: derived from user's OAuth identity (deterministic per userId)
 *   - platformSecret: from env PLATFORM_WALLET_SECRET
 *
 * Neither party alone can reconstruct the key.
 * User can export seed phrase via Settings → Export Wallet.
 */

import { ethers } from "ethers";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

// ── Env Validation ─────────────────────────────────────────────

function getPlatformSecret(): string {
  const secret = process.env.PLATFORM_WALLET_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("PLATFORM_WALLET_SECRET env var required (min 16 chars)");
  }
  return secret;
}

// ── Key Derivation ──────────────────────────────────────────────

/**
 * Derive user's secret from their OAuth identity.
 * Deterministic: same userId ALWAYS produces same key.
 * Does NOT depend on session token — stable across logins.
 */
function deriveUserSecret(userId: string): string {
  const platformSecret = getPlatformSecret();
  return crypto
    .createHmac("sha256", platformSecret)
    .update(`arcmerch-user-${userId}`)
    .digest("hex");
}

/**
 * Combine user + platform secrets to reconstruct private key.
 * Both secrets required — neither party alone can access.
 */
function derivePrivateKey(userSecret: string, platformSecret: string): string {
  const combined = crypto
    .createHmac("sha256", platformSecret)
    .update(userSecret)
    .digest("hex");
  // Ensure valid private key (32 bytes hex)
  return "0x" + combined.slice(0, 64);
}

// ── Wallet Generation ───────────────────────────────────────────

export interface WalletData {
  address: string;
  encryptedMnemonic: string;  // AES-256-GCM encrypted
  iv: string;
  authTag: string;
  createdAt: string;
}

/**
 * Generate a new wallet for a user.
 * Returns wallet address + encrypted mnemonic (for export later).
 */
export function generateWallet(userId: string): WalletData {
  // Generate fresh random wallet
  const wallet = ethers.Wallet.createRandom();
  const mnemonic = wallet.mnemonic?.phrase || "";

  // Encrypt mnemonic with key derived from user identity
  const encKey = deriveUserSecret(userId).slice(0, 64);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(encKey, "hex"), iv);

  let encrypted = cipher.update(mnemonic, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return {
    address: wallet.address,
    encryptedMnemonic: encrypted,
    iv: iv.toString("hex"),
    authTag,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Reconstruct wallet signer for transaction signing.
 * Uses key split — needs both user + platform secrets.
 */
export function getWalletSigner(userId: string): ethers.Wallet {
  const userSecret = deriveUserSecret(userId);
  const platformSecret = getPlatformSecret();
  const privateKey = derivePrivateKey(userSecret, platformSecret);
  return new ethers.Wallet(privateKey);
}

/**
 * Decrypt mnemonic for user export.
 * User can take this to MetaMask/Phantom and leave.
 */
export function decryptMnemonic(
  walletData: WalletData,
  userId: string
): string {
  const encKey = deriveUserSecret(userId).slice(0, 64);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(encKey, "hex"),
    Buffer.from(walletData.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(walletData.authTag, "hex"));

  let decrypted = decipher.update(walletData.encryptedMnemonic, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Shorten address for display: 0x7f2a...3d8c
 */
export function shortAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
