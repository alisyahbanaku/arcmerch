"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { shortAddress } from "@/lib/wallet";
import { useAccount, useConnect } from "wagmi";
import { formatUnits } from "viem";
import { useArcMerch } from "@/hooks/useArcMerch";
import {
  Wallet, Copy, Check, Download, Eye, EyeOff, Shield, AlertTriangle,
  ExternalLink, Package, Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/verified-badge";

// ── On-Chain Wallet Card ───────────────────────────────────────

function OnChainCard() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { usdcBalanceFormatted, nftBalance, mintPriceFormatted } = useArcMerch();
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
            <p className="text-[13px] text-white/30">Connect to view on-chain assets</p>
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <LinkIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-[18px] font-light text-white">On-Chain Wallet</h3>
          <p className="text-[13px] text-white/30">Connected to Arc Testnet</p>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div className="text-[12px] text-white/30 uppercase tracking-wider mb-2">Wallet Address</div>
        <div className="flex items-center justify-between">
          <code className="text-[15px] text-white font-mono">{shortAddress(address || "")}</code>
          <button onClick={copyAddress} className="text-white/40 hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
          <div className="text-[11px] text-white/25 uppercase tracking-wider mb-1">USDC Balance</div>
          <div className="text-[16px] font-light text-white mono">{usdcBalanceFormatted}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
          <div className="text-[11px] text-white/25 uppercase tracking-wider mb-1">NFTs Owned</div>
          <div className="text-[16px] font-light text-white mono">{nftBalance?.toString() || "0"}</div>
        </div>
      </div>

      {/* Links */}
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

// ── Auth Wallet Card (Hybrid Custody) ──────────────────────────

function AuthWalletCard() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [exporting, setExporting] = useState(false);

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/wallet/export", { method: "POST" });
      const data = await res.json();
      if (data.mnemonic) {
        setMnemonic(data.mnemonic);
        setShowExport(true);
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
    setExporting(false);
  };

  if (!user) return null;

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
          <Wallet className="w-7 h-7 text-black" />
        </div>
        <div>
          <h3 className="text-[18px] font-light text-white">Platform Wallet</h3>
          <p className="text-[13px] text-white/30">Hybrid custody — export anytime</p>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
        <div className="text-[12px] text-white/30 uppercase tracking-wider mb-2">Wallet Address</div>
        <div className="flex items-center justify-between">
          <code className="text-[15px] text-white font-mono">{shortAddress(user.walletAddress)}</code>
          <button onClick={copyAddress} className="text-white/40 hover:text-white transition-colors">
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Network Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
          <div className="text-[11px] text-white/25 uppercase tracking-wider mb-1">Network</div>
          <div className="text-[14px] text-white">Arc Testnet</div>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3">
          <div className="text-[11px] text-white/25 uppercase tracking-wider mb-1">Chain ID</div>
          <div className="text-[14px] text-white font-mono">5042002</div>
        </div>
      </div>

      {/* Security Model */}
      <div className="bg-[#E9A13F]/5 border border-[#E9A13F]/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-[#E9A13F]" />
          <span className="text-[13px] font-medium text-[#E9A13F]">Hybrid Custody</span>
        </div>
        <p className="text-[13px] text-white/40 leading-relaxed">
          Your key is split: part from your identity, part from our platform.
          Neither party alone can access it. You can export your seed phrase and leave anytime.
        </p>
      </div>

      {/* Export */}
      {!showExport ? (
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full flex items-center justify-center gap-2 btn-outline text-[14px] py-3"
        >
          <Download className="w-4 h-4" />
          {exporting ? "Decrypting..." : "Export Seed Phrase"}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[13px] font-medium">Never share this phrase</span>
          </div>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] text-white/30 uppercase tracking-wider">Seed Phrase</span>
              <button
                onClick={() => setShowMnemonic(!showMnemonic)}
                className="text-white/40 hover:text-white transition-colors"
              >
                {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {showMnemonic ? (
              <div className="grid grid-cols-3 gap-2">
                {mnemonic?.split(" ").map((word, i) => (
                  <div key={i} className="bg-white/5 rounded-lg px-3 py-2 text-center">
                    <span className="text-[11px] text-white/25">{i + 1}.</span>
                    <span className="text-[14px] text-white font-mono ml-1">{word}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <Eye className="w-6 h-6 text-white/20 mx-auto mb-2" />
                <span className="text-[13px] text-white/20">Click eye to reveal</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setShowExport(false);
              setMnemonic(null);
              setShowMnemonic(false);
            }}
            className="text-[13px] text-white/30 hover:text-white/60 transition-colors"
          >
            Hide seed phrase
          </button>
        </div>
      )}
    </div>
  );
}

// ── NFT Gallery (Mock) ──────────────────────────────────────────

function NFTGallery() {
  const mockNFTs = [
    { id: 1, name: "Arc Genesis Tee", image: "/api/placeholder/300/300", status: "minted" },
    { id: 2, name: "USDC Hoodie", image: "/api/placeholder/300/300", status: "listed" },
    { id: 3, name: "Stablecoin Cap", image: "/api/placeholder/300/300", status: "burned" },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-light text-white">My NFTs</h3>
        <span className="text-[13px] text-white/30">{mockNFTs.length} items</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {mockNFTs.map((nft) => (
          <div key={nft.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden group hover:border-white/10 transition-colors">
            <div className="aspect-square bg-white/[0.02] flex items-center justify-center">
              <Package className="w-10 h-10 text-white/10" />
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

// ── Activity (Mock) ─────────────────────────────────────────────

function ActivityFeed() {
  const activities = [
    { icon: Wallet, text: "Wallet created", time: "Just now", color: "text-green-400" },
    { icon: Wallet, text: "Signed in with X", time: "Just now", color: "text-blue-400" },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-[18px] font-light text-white mb-6">Activity</h3>
      <div className="space-y-4">
        {activities.map((a, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <a.icon className={`w-4 h-4 ${a.color}`} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] text-white">{a.text}</div>
              <div className="text-[12px] text-white/25">{a.time}</div>
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
          <Wallet className="w-8 h-8 text-white/20" />
        </div>
        <h2 className="text-[24px] font-light text-white mb-3">Sign in to view profile</h2>
        <p className="text-[15px] text-white/40 mb-8 leading-relaxed">
          Connect with X to auto-create your Arc wallet. Hybrid custody — your key, your control.
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
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/10 border-t-[#E9A13F] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <NotSignedIn />;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Ambient glow — matches homepage */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <section className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
      <div className="mb-10">
        <div className="section-label mb-3">{"{ PROFILE }"}</div>
        <h1 className="text-[28px] sm:text-[36px] md:text-[56px] font-light tracking-[-0.02em] text-white flex items-center gap-3">
          Welcome, {user?.twitterHandle}
          {user?.verified ? <VerifiedBadge size="lg" /> : null}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Wallets */}
        <div className="lg:col-span-1 space-y-6">
          <OnChainCard />
          <AuthWalletCard />
          <ActivityFeed />
        </div>

        {/* Right: NFTs */}
        <div className="lg:col-span-2">
          <NFTGallery />
        </div>
      </div>
      </section>
    </div>
  );
}
