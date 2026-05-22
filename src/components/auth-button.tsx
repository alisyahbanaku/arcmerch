"use client";

import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { LogOut, Wallet, Copy, Check, ChevronDown, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { VerifiedBadge } from "@/components/verified-badge";

function shortAddr(addr: string) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// ── Wallet Dropdown ─────────────────────────────────────────────

function WalletDropdown() {
  const { user, logout } = usePrivy();
  const { wallets } = useWallets();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const primaryWallet = wallets[0];
  const address = primaryWallet?.address || "";

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Get display name from linked accounts
  const twitterAccount = user?.linkedAccounts?.find(a => a.type === "twitter_oauth");
  const googleAccount = user?.linkedAccounts?.find(a => a.type === "google_oauth");
  const emailAccount = user?.linkedAccounts?.find(a => a.type === "email");

  const displayName = twitterAccount
    ? `@${(twitterAccount as unknown as unknown as Record<string, unknown>).username || (twitterAccount as unknown as unknown as Record<string, unknown>).name || "user"}`
    : googleAccount
    ? String((googleAccount as unknown as unknown as Record<string, unknown>).name || "Google User")
    : emailAccount
    ? String((emailAccount as unknown as Record<string, unknown>).address || "Email User")
    : shortAddr(address);

  const isVerified = !!twitterAccount || !!googleAccount;
  const avatarLetter = displayName.replace("@", "").charAt(0).toUpperCase() || "?";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg py-2 px-3 hover:border-white/20 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
          <span className="text-[12px] font-semibold text-black">{avatarLetter}</span>
        </div>
        <span className="text-[14px] text-white hidden sm:inline">{displayName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-[70] w-[280px] bg-[#111] border border-white/10 rounded-xl p-4 shadow-2xl">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
                <span className="text-[16px] font-semibold text-black">{avatarLetter}</span>
              </div>
              <div>
                <div className="text-[14px] font-medium text-white flex items-center gap-1.5">
                  {displayName}
                  {isVerified ? <VerifiedBadge /> : <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Unverified</span>}
                </div>
                {address && (
                  <div className="text-[12px] text-white/30 font-mono">{shortAddr(address)}</div>
                )}
              </div>
            </div>

            {/* Linked Accounts */}
            {user?.linkedAccounts && user.linkedAccounts.length > 0 && (
              <div className="mb-3 pb-3 border-b border-white/[0.06]">
                <p className="text-[11px] text-white/25 uppercase tracking-wider mb-2">Linked</p>
                <div className="space-y-1.5">
                  {user.linkedAccounts.map((account, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px] text-white/40">
                      <span className="w-4 text-center">
                        {account.type.includes("twitter") ? "𝕏" : account.type.includes("google") ? "G" : account.type.includes("email") ? "✉" : account.type.includes("wallet") ? "⟠" : "?"}
                      </span>
                      <span className="truncate">
                        {account.type.includes("twitter") && `@${(account as unknown as Record<string, unknown>).username || (account as unknown as Record<string, unknown>).name || "user"}`}
                        {account.type.includes("google") && String((account as unknown as Record<string, unknown>).name || (account as unknown as Record<string, unknown>).email || "Google")}
                        {account.type.includes("email") && String((account as unknown as Record<string, unknown>).address || (account as unknown as Record<string, unknown>).email || "Email")}
                        {account.type.includes("wallet") && shortAddr((account as unknown as Record<string, unknown>).address as string || "")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-1">
              {address && (
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
              {address && (
                <a
                  href={`https://testnet.arcscan.app/address/${address}`}
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

// ── Sign In Modal (Demo Login fallback) ─────────────────────────

function DemoLoginModal({ onClose }: { onClose: () => void }) {
  const [handle, setHandle] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[80px] sm:pt-[100px]">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#111] border border-white/10 rounded-xl p-6 sm:p-8 w-full max-w-[380px] mx-4">
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/40 hover:text-white text-xl">×</button>
        <h2 className="text-[20px] font-light text-white mb-2">Demo Mode</h2>
        <p className="text-[13px] text-white/40 mb-5">Quick test — no real wallet created.</p>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@yourhandle"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-white placeholder-white/20 focus:outline-none focus:border-[#E9A13F]/50 mb-3"
        />
        <button
          onClick={onClose}
          disabled={!handle.trim()}
          className="w-full btn-outline text-[14px] py-3 disabled:opacity-30"
        >
          Continue as Demo
        </button>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────

export function AuthButton() {
  const { ready, authenticated, login } = usePrivy();
  const [showDemo, setShowDemo] = useState(false);

  if (!ready) {
    return (
      <div className="w-[140px] h-[42px] bg-white/5 rounded-lg animate-pulse" />
    );
  }

  if (authenticated) {
    return <WalletDropdown />;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button onClick={login} className="btn-outline text-[14px] py-2.5 px-5">
          Sign In
        </button>
      </div>
      {showDemo && <DemoLoginModal onClose={() => setShowDemo(false)} />}
    </>
  );
}
