"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useActiveWallet } from "@/lib/wallet-context";
import { LogOut, Wallet, Copy, Check, ChevronDown, User, ExternalLink, Plus, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

function shortAddr(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function AuthButton() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { allWallets, activeWallet, setActiveWallet, connectExternalWallet } = useActiveWallet();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  if (!ready) {
    return <div className="w-[120px] h-[40px] bg-white/5 rounded-lg animate-pulse" />;
  }

  if (!authenticated) {
    return (
      <button onClick={login} className="btn-outline text-[14px] py-2.5 px-5">
        Sign In
      </button>
    );
  }

  // Identity info
  const twitterAccount = user?.linkedAccounts?.find((a: any) => a.type === "twitter_oauth");
  const googleAccount = user?.linkedAccounts?.find((a: any) => a.type === "google_oauth");
  const emailAccount = user?.linkedAccounts?.find((a: any) => a.type === "email");

  const displayName = twitterAccount
    ? `@${(twitterAccount as any).username || "user"}`
    : googleAccount
    ? String((googleAccount as any).name || "User")
    : emailAccount
    ? String((emailAccount as any).address || "User")
    : shortAddr(activeWallet?.address || "");

  const isVerified = !!twitterAccount;
  const avatarLetter = displayName.replace("@", "").charAt(0).toUpperCase() || "?";

  const copyAddress = () => {
    if (activeWallet?.address) {
      navigator.clipboard.writeText(activeWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg py-2 px-3 hover:border-white/20 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
          <span className="text-[12px] font-semibold text-black">{avatarLetter}</span>
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-[13px] text-white leading-tight flex items-center gap-1">
            {displayName}
            {isVerified && <span className="text-[10px] text-[#E9A13F]">✓</span>}
          </span>
          {activeWallet && (
            <span className="text-[10px] text-white/30 font-mono leading-tight">{shortAddr(activeWallet.address)}</span>
          )}
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-[70] w-[320px] bg-[#111] border border-white/10 rounded-xl p-4 shadow-2xl">
            {/* Identity */}
            <div className="mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
                  <span className="text-[16px] font-semibold text-black">{avatarLetter}</span>
                </div>
                <div>
                  <div className="text-[14px] font-medium text-white flex items-center gap-1.5">
                    {displayName}
                    {isVerified ? (
                      <span className="text-[9px] bg-[#E9A13F]/10 text-[#E9A13F] border border-[#E9A13F]/20 px-1.5 py-0.5 rounded">VERIFIED</span>
                    ) : (
                      <span className="text-[9px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Unverified</span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/35">
                    {twitterAccount ? "X (Twitter)" : googleAccount ? "Google" : "Email"}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Switcher */}
            <div className="mb-4 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-white/25 uppercase tracking-wider flex items-center gap-1">
                  <ArrowLeftRight className="w-3 h-3" /> Active Wallet
                </p>
              </div>
              <div className="space-y-2">
                {allWallets.map(w => (
                  <button
                    key={w.address}
                    onClick={() => setActiveWallet(w.address)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                      activeWallet?.address === w.address
                        ? "bg-[#E9A13F]/10 border border-[#E9A13F]/20"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Wallet className={`w-4 h-4 ${activeWallet?.address === w.address ? "text-[#E9A13F]" : "text-white/40"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-white/60 flex items-center gap-1.5">
                        <span className="font-mono">{shortAddr(w.address)}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                          w.type === "embedded" ? "bg-[#E9A13F]/10 text-[#E9A13F]" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {w.type === "embedded" ? "Embedded" : w.label}
                        </span>
                      </div>
                    </div>
                    {activeWallet?.address === w.address && (
                      <span className="text-[9px] text-[#E9A13F]">●</span>
                    )}
                  </button>
                ))}
                {/* Connect External */}
                <button
                  onClick={() => { connectExternalWallet(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-white/5 border border-dashed border-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4 text-white/30" />
                  <span className="text-[12px] text-white/40">Connect External Wallet</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              {activeWallet && (
                <button
                  onClick={copyAddress}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Address"}
                </button>
              )}
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              {activeWallet && (
                <a
                  href={`https://testnet.arcscan.app/address/${activeWallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Explorer
                </a>
              )}
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
