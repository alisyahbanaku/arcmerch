"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { shortAddress } from "@/lib/wallet";
import { LogOut, Wallet, Copy, Check, ChevronDown, User } from "lucide-react";
import Link from "next/link";
import { VerifiedBadge, UnverifiedBadge } from "@/components/verified-badge";

// ── Sign In Modal ───────────────────────────────────────────────

function SignInModal({ onClose }: { onClose: () => void }) {
  const [handle, setHandle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (!handle.trim()) return;
    setIsLoading(true);
    try {
      const { signIn } = await import("next-auth/react");
      await signIn("credentials", {
        username: handle.replace("@", ""),
        redirect: false,
      });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Sign in failed:", err);
    }
    setIsLoading(false);
  };

  const handleTwitterLogin = async () => {
    setIsLoading(true);
    try {
      const { signIn } = await import("next-auth/react");
      await signIn("twitter", { callbackUrl: "/profile" });
    } catch (err) {
      console.error("Twitter sign in failed:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#111] border border-white/10 rounded-xl p-8 w-full max-w-[420px] mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white text-xl">×</button>

        <div className="text-center mb-8">
          <h2 className="text-[22px] font-light text-white mb-2">Sign In to ArcMerch</h2>
          <p className="text-[14px] text-white/40">Wallet auto-created. No seed phrase to manage.</p>
        </div>

        {/* Twitter OAuth */}
        <button
          onClick={handleTwitterLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-medium text-[15px] py-3.5 px-6 rounded-lg hover:bg-white/90 transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          {isLoading ? "Connecting..." : "Sign in with X"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[12px] text-white/30 uppercase tracking-wider">or demo mode</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Demo Login */}
        <div className="space-y-3">
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@yourhandle"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[15px] text-white placeholder-white/20 focus:outline-none focus:border-[#E9A13F]/50 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleDemoLogin()}
          />
          <button
            onClick={handleDemoLogin}
            disabled={isLoading || !handle.trim()}
            className="w-full btn-outline text-[14px] py-3 disabled:opacity-30"
          >
            {isLoading ? "Creating wallet..." : "Demo Login (test only)"}
          </button>
        </div>

        <p className="text-[12px] text-white/20 mt-6 text-center leading-relaxed">
          Hybrid custody: your key is split between your identity and our platform.
          You can export anytime. We never see your full key.
        </p>
      </div>
    </div>
  );
}

// ── Wallet Dropdown ─────────────────────────────────────────────

function WalletDropdown() {
  const { user, signOut } = useAuth();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyAddress = () => {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg py-2 px-3 hover:border-white/20 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
          <span className="text-[12px] font-semibold text-black">
            {user.twitterHandle?.replace("@", "").charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-[14px] text-white hidden sm:inline">{user.twitterHandle}</span>
        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-[70] w-[260px] bg-[#111] border border-white/10 rounded-xl p-4 shadow-2xl">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/[0.06]">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
                <span className="text-[16px] font-semibold text-black">
                  {user.twitterHandle?.replace("@", "").charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-[14px] font-medium text-white flex items-center gap-1.5">
                  {user.twitterHandle}
                  {user.verified ? <VerifiedBadge /> : <UnverifiedBadge />}
                </div>
                <div className="text-[12px] text-white/30 font-mono">{shortAddress(user.walletAddress)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Address"}
              </button>
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile & Wallet
              </Link>
              <button
                onClick={() => signOut()}
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

// ── Main Component ──────────────────────────────────────────────

export function AuthButton() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return (
      <div className="w-[140px] h-[42px] bg-white/5 rounded-lg animate-pulse" />
    );
  }

  if (isAuthenticated) {
    return <WalletDropdown />;
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn-outline text-[14px] py-2.5 px-5">
        Sign In
      </button>
      {showModal && <SignInModal onClose={() => setShowModal(false)} />}
    </>
  );
}
