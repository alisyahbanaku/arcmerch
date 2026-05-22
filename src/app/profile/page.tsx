"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useAccount, useConnect } from "wagmi";
import { shortAddress } from "@/lib/wallet";
import {
  Wallet, Copy, Check, Package, Link as LinkIcon, ExternalLink, Shield
} from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/verified-badge";

// ── Helper: Get display info from Privy user ────────────────────

function getUserInfo(user: ReturnType<typeof usePrivy>["user"]) {
  const twitter = user?.linkedAccounts?.find(a => a.type === "twitter_oauth") as unknown as Record<string, unknown> | undefined;
  const google = user?.linkedAccounts?.find(a => a.type === "google_oauth") as unknown as Record<string, unknown> | undefined;
  const email = user?.linkedAccounts?.find(a => a.type === "email") as unknown as Record<string, unknown> | undefined;
  const wallet = user?.linkedAccounts?.find(a => a.type === "wallet") as unknown as Record<string, unknown> | undefined;

  return {
    displayName: twitter
      ? `@${twitter.username || twitter.name || "user"}`
      : google
      ? String(google.name || "Google User")
      : email
      ? String(email.address || "Email User")
      : "Anonymous",
    isVerified: !!twitter || !!google,
    avatarLetter: (twitter ? String(twitter.username || twitter.name || "u") : "u").charAt(0).toUpperCase(),
    method: twitter ? "Twitter" : google ? "Google" : email ? "Email" : "Wallet",
    walletAddress: (wallet?.address as string) || null,
  };
}

// ── On-Chain Wallet Card ────────────────────────────────────────

function OnChainCard() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <LinkIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-[18px] font-light text-white">Connect Wallet</h3>
            <p className="text-[13px] text-white/45">Connect external wallet for on-chain actions</p>
          </div>
        </div>
        <button
          onClick={() => {
            const injected = connectors.find((c) => c.id === "injected");
            if (injected) connect({ connector: injected });
          }}
          className="w-full arc-btn justify-center py-3"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <LinkIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-[18px] font-light text-white">On-Chain Wallet</h3>
          <p className="text-[13px] text-white/45">Connected to Arc Testnet</p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div className="text-[12px] text-white/45 uppercase tracking-wider mb-2">Wallet Address</div>
        <div className="flex items-center justify-between">
          <code className="text-[15px] text-white font-mono">{shortAddress(address || "")}</code>
          <button onClick={copyAddress} className="text-white/40 hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href={`https://testnet.arcscan.app/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-[13px] text-white/40 hover:text-white hover:border-white/20 transition-colors"
        >
          Explorer <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://faucet.circle.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-[13px] text-white/40 hover:text-white hover:border-white/20 transition-colors"
        >
          Faucet <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ── Privy Wallet Card ───────────────────────────────────────────

function PrivyWalletCard() {
  const { wallets } = useWallets();
  const [copied, setCopied] = useState(false);

  const embeddedWallet = wallets.find(w => w.walletClientType === "privy");
  const address = embeddedWallet?.address || "";

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card p-6 space-y-5">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
          <Wallet className="w-7 h-7 text-black" />
        </div>
        <div>
          <h3 className="text-[18px] font-light text-white">Embedded Wallet</h3>
          <p className="text-[13px] text-white/45">Auto-created by Privy</p>
        </div>
      </div>

      {address ? (
        <>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="text-[12px] text-white/45 uppercase tracking-wider mb-2">Wallet Address</div>
            <div className="flex items-center justify-between">
              <code className="text-[15px] text-white font-mono">{shortAddress(address)}</code>
              <button onClick={copyAddress} className="text-white/40 hover:text-white transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Network</div>
              <div className="text-[14px] text-white">Arc Testnet</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
              <div className="text-[11px] text-white/40 uppercase tracking-wider mb-1">Chain ID</div>
              <div className="text-[14px] text-white font-mono">5042002</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-[14px] text-white/40">No embedded wallet yet. Sign in with social to create one.</p>
        </div>
      )}

      <div className="bg-[#E9A13F]/5 border border-[#E9A13F]/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#E9A13F]" />
          <span className="text-[13px] font-medium text-[#E9A13F]">Non-Custodial</span>
        </div>
        <p className="text-[13px] text-white/40 leading-relaxed">
          Privy creates and manages your wallet securely. You can export your private key anytime from settings. Your keys, your assets.
        </p>
      </div>
    </div>
  );
}

// ── NFT Gallery (Mock) ──────────────────────────────────────────

function NFTGallery() {
  const mockNFTs = [
    { id: 1, name: "Arc Genesis Tee", status: "minted" },
    { id: 2, name: "USDC Hoodie", status: "listed" },
    { id: 3, name: "Stablecoin Cap", status: "burned" },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-light text-white">My NFTs</h3>
        <span className="text-[13px] text-white/45">{mockNFTs.length} items</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {mockNFTs.map((nft) => (
          <div key={nft.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden group hover:border-white/10 transition-colors">
            <div className="aspect-square bg-white/[0.04] flex items-center justify-center">
              <Package className="w-10 h-10 text-white/40" />
            </div>
            <div className="p-3">
              <div className="text-[14px] text-white mb-1">{nft.name}</div>
              <span className={`text-[12px] px-2 py-0.5 rounded-full ${
                nft.status === "minted" ? "bg-blue-500/10 text-blue-400" :
                nft.status === "listed" ? "bg-[#E9A13F]/10 text-[#E9A13F]" :
                "bg-red-500/10 text-red-400"
              }`}>
                {nft.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Not Authenticated ───────────────────────────────────────────

function NotSignedIn() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-[400px] mx-auto px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-8 h-8 text-white/35" />
        </div>
        <h2 className="text-[24px] font-light text-white mb-3">Sign in to view profile</h2>
        <p className="text-[15px] text-white/40 mb-8 leading-relaxed">
          Sign in with X, Google, or email to auto-create your Arc wallet.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

// ── Profile Page ────────────────────────────────────────────────

export default function ProfilePage() {
  const { ready, authenticated, user } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#E9A13F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return <NotSignedIn />;

  const info = getUserInfo(user);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <section className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="mb-10">
          <div className="section-label mb-3">{"{ PROFILE }"}</div>
          <h1 className="text-[28px] sm:text-[36px] md:text-[56px] font-light tracking-[-0.02em] text-white flex items-center gap-3">
            Welcome, {info.displayName}
            {info.isVerified ? <VerifiedBadge size="lg" /> : null}
          </h1>
          <p className="text-[14px] text-white/40 mt-2">
            Signed in via {info.method}
            {info.walletAddress && <> · Wallet: <code className="font-mono">{shortAddress(info.walletAddress)}</code></>}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <OnChainCard />
            <PrivyWalletCard />
          </div>
          <div className="lg:col-span-2">
            <NFTGallery />
          </div>
        </div>
      </section>
    </div>
  );
}
