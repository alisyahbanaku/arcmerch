"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import { Wallet, Copy, Check, ExternalLink, Shield, Key, Link2 } from "lucide-react";

function shortAddr(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

export default function ProfilePage() {
  const { ready, authenticated, user, login, exportWallet } = usePrivy();
  const { wallets } = useWallets();
  const [copied, setCopied] = useState(false);

  if (!ready) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E9A13F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="bg-black text-white min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />
        <div className="relative mx-auto max-w-[600px] px-4 py-20 text-center">
          <h1 className="text-[32px] font-light text-white mb-4">Your Profile</h1>
          <p className="text-[15px] text-white/70 mb-8">Sign in to view your wallet, designs, and creator status.</p>
          <button onClick={login} className="arc-btn text-[15px] px-8 py-3">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const embeddedWallet = wallets.find(w => w.walletClientType === "privy");
  const externalWallets = wallets.filter(w => w.walletClientType !== "privy");
  const primaryAddress = embeddedWallet?.address || wallets[0]?.address || "";

  // Identity
  const twitterAccount = user?.linkedAccounts?.find((a: any) => a.type === "twitter_oauth");
  const googleAccount = user?.linkedAccounts?.find((a: any) => a.type === "google_oauth");
  const emailAccount = user?.linkedAccounts?.find((a: any) => a.type === "email");

  const displayName = twitterAccount
    ? `@${(twitterAccount as any).username || "user"}`
    : googleAccount
    ? String((googleAccount as any).name || "User")
    : emailAccount
    ? String((emailAccount as any).address || "User")
    : shortAddr(primaryAddress);

  const isVerified = !!twitterAccount;
  const avatarLetter = displayName.replace("@", "").charAt(0).toUpperCase() || "?";

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[800px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="section-label mb-3">{"{ PROFILE }"}</div>

        {/* Identity Card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
              <span className="text-[24px] font-semibold text-black">{avatarLetter}</span>
            </div>
            <div>
              <h1 className="text-[24px] font-light text-white flex items-center gap-2">
                {displayName}
                {isVerified ? (
                  <span className="text-[11px] bg-[#E9A13F]/10 text-[#E9A13F] border border-[#E9A13F]/20 px-2 py-0.5 rounded font-medium">✓ VERIFIED CREATOR</span>
                ) : (
                  <span className="text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded">Unverified</span>
                )}
              </h1>
              <p className="text-[13px] text-white/70 mt-1">
                Joined via {twitterAccount ? "X (Twitter)" : googleAccount ? "Google" : "Email"}
              </p>
            </div>
          </div>

          {/* Linked Accounts */}
          <div className="border-t border-white/[0.06] pt-4">
            <p className="text-[11px] text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Link2 className="w-3 h-3" /> Linked Accounts
            </p>
            <div className="space-y-2">
              {user?.linkedAccounts?.map((account: any, i: number) => (
                <div key={i} className="flex items-center gap-3 text-[13px]">
                  <span className="w-5 text-center text-white/70">
                    {account.type.includes("twitter") ? "𝕏" : account.type.includes("google") ? "G" : account.type.includes("email") ? "✉" : "⟠"}
                  </span>
                  <span className="text-white/60">
                    {account.type.includes("twitter") && `@${account.username || account.name || "user"}`}
                    {account.type.includes("google") && (account.name || account.email || "Google")}
                    {account.type.includes("email") && (account.address || account.email || "Email")}
                    {account.type.includes("wallet") && shortAddr(account.address || "")}
                  </span>
                  {account.type.includes("twitter") && (
                    <span className="text-[9px] text-[#E9A13F] bg-[#E9A13F]/10 px-1.5 py-0.5 rounded">Creator ID</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wallet Card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="w-5 h-5 text-[#E9A13F]" />
            <h2 className="text-[18px] font-light text-white">Your Wallet</h2>
          </div>

          {/* Embedded Wallet */}
          {embeddedWallet && (
            <div className="rounded-lg border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#E9A13F] bg-[#E9A13F]/10 border border-[#E9A13F]/20 px-2 py-0.5 rounded font-medium">PRIMARY</span>
                  <span className="text-[11px] text-white/50">Embedded Wallet</span>
                </div>
                <button
                  onClick={() => copyAddress(embeddedWallet.address)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="font-mono text-[15px] text-white mb-3">{shortAddr(embeddedWallet.address)}</div>
              <div className="flex items-center gap-3">
                <a
                  href={`https://testnet.arcscan.app/address/${embeddedWallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-white/70 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Explorer
                </a>
                <button
                  onClick={() => exportWallet()}
                  className="text-[12px] text-[#E9A13F]/70 hover:text-[#E9A13F] flex items-center gap-1 transition-colors"
                >
                  <Key className="w-3 h-3" /> Export Seed Phrase
                </button>
              </div>
            </div>
          )}

          {/* External Wallets */}
          {externalWallets.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] text-white/50 uppercase tracking-wider">External Wallets</p>
              {externalWallets.map((w, i) => (
                <div key={i} className="rounded-lg border border-white/10 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-white/50 bg-white/5 px-1.5 py-0.5 rounded">{w.walletClientType}</span>
                    <span className="font-mono text-[13px] text-white/60">{shortAddr(w.address)}</span>
                  </div>
                  <a
                    href={`https://testnet.arcscan.app/address/${w.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {!embeddedWallet && wallets.length === 0 && (
            <div className="text-center py-6">
              <p className="text-[14px] text-white/70">Wallet is being created...</p>
              <div className="w-6 h-6 border-2 border-[#E9A13F] border-t-transparent rounded-full animate-spin mx-auto mt-3" />
            </div>
          )}
        </div>

        {/* Security Info */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#E9A13F]" />
            <h2 className="text-[18px] font-light text-white">Security</h2>
          </div>
          <div className="space-y-3 text-[13px] text-white/70">
            <p>• Your embedded wallet is secured by Privy — keys are split across multiple parties</p>
            <p>• Export your seed phrase anytime from this page</p>
            <p>• X verification proves your creator identity on the marketplace</p>
            <p>• All transactions happen on Arc Testnet (Chain ID: 5042002)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
