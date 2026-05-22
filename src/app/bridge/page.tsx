"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { ArrowRight, Loader2, Check, ExternalLink, Globe, Zap, Shield } from "lucide-react";

const BRIDGE_CHAINS = [
  { id: "ethereum", name: "Ethereum Sepolia", icon: "⟠", color: "#627EEA" },
  { id: "base", name: "Base Sepolia", icon: "🔷", color: "#0052FF" },
  { id: "arbitrum", name: "Arbitrum Sepolia", icon: "🔵", color: "#28A0F0" },
  { id: "optimism", name: "Optimism Sepolia", icon: "🔴", color: "#FF0420" },
];

export default function BridgePage() {
  const { ready, authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [fromChain, setFromChain] = useState("base");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "success">("select");

  const embeddedWallet = wallets.find(w => w.walletClientType === "privy");
  const address = embeddedWallet?.address || wallets[0]?.address || "";

  if (!ready) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E9A13F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const selectedChain = BRIDGE_CHAINS.find(c => c.id === fromChain);

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(233,161,63,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-[720px] px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="section-label mb-3">{"{ BRIDGE }"}</div>
        <h1 className="text-[28px] sm:text-[36px] md:text-[56px] font-light tracking-[-0.02em] text-white mb-3">
          Bridge USDC
        </h1>
        <p className="text-[16px] text-white/40 mb-12">
          Transfer USDC from any chain to Arc Testnet. Your embedded wallet receives the funds.
        </p>

        {/* Not logged in */}
        {!authenticated && (
          <div className="rounded-xl border border-[#E9A13F]/20 bg-[#E9A13F]/5 p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Globe className="w-5 h-5 text-[#E9A13F]" />
              <span className="text-[15px] font-medium text-white">Sign in to bridge</span>
            </div>
            <p className="text-[13px] text-white/40 mb-4">
              Sign in to get your embedded wallet and bridge USDC to Arc Testnet.
            </p>
            <button onClick={login} className="arc-btn text-sm px-6 py-2.5">
              Sign In
            </button>
          </div>
        )}

        {/* Logged in — Bridge Widget */}
        {authenticated && (
          <>
            {/* Wallet Info */}
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E9A13F] to-[#c47f1a] flex items-center justify-center">
                  <span className="text-[11px] font-bold text-black">⟠</span>
                </div>
                <div>
                  <p className="text-[13px] text-white/60">Receiving wallet (Arc Testnet)</p>
                  <p className="text-[14px] font-mono text-white">{address ? `${address.slice(0,10)}...${address.slice(-6)}` : "Creating..."}</p>
                </div>
              </div>
              {address && (
                <a
                  href={`https://testnet.arcscan.app/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-white/40 hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Explorer
                </a>
              )}
            </div>

            {/* Bridge Form */}
            <div className="rounded-xl border border-white/10 p-6">
              {step === "select" && (
                <div className="space-y-6">
                  <h3 className="text-[18px] font-light text-white">Select source chain</h3>

                  <div className="grid grid-cols-2 gap-3">
                    {BRIDGE_CHAINS.map(chain => (
                      <button
                        key={chain.id}
                        onClick={() => setFromChain(chain.id)}
                        className={`rounded-lg border p-4 text-left transition-all duration-150 ${
                          fromChain === chain.id
                            ? "border-[#E9A13F] bg-[#E9A13F]/5"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[18px]">{chain.icon}</span>
                          <span className="text-[14px] font-medium text-white">{chain.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[13px] text-white/40 mb-3 block">Amount (USDC)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full rounded-lg border border-white/10 bg-transparent p-4 text-[18px] font-light text-white placeholder:text-white/35 focus:border-white/25 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">{selectedChain?.icon}</span>
                      <span className="text-[14px] text-white/60">{selectedChain?.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#E9A13F]" />
                    <div className="flex items-center gap-2">
                      <span className="text-[18px]">🔵</span>
                      <span className="text-[14px] text-white/60">Arc Testnet</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("confirm")}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full btn-primary justify-center py-4 text-[16px] disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>

                  <p className="text-[11px] text-white/30 text-center">
                    Bridge powered by Circle CCTP • Funds arrive in ~30 seconds
                  </p>
                </div>
              )}

              {step === "confirm" && (
                <div className="space-y-6">
                  <h3 className="text-[18px] font-light text-white">Confirm bridge</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-white/[0.06]">
                      <span className="text-[13px] text-white/40">From</span>
                      <span className="text-[13px] text-white">{selectedChain?.icon} {selectedChain?.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/[0.06]">
                      <span className="text-[13px] text-white/40">To</span>
                      <span className="text-[13px] text-white">🔵 Arc Testnet</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/[0.06]">
                      <span className="text-[13px] text-white/40">Amount</span>
                      <span className="mono text-[13px] text-white">{amount} USDC</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-white/[0.06]">
                      <span className="text-[13px] text-white/40">Receive at</span>
                      <span className="mono text-[12px] text-white/60">{address ? `${address.slice(0,10)}...${address.slice(-4)}` : ""}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-[13px] text-white/40">Est. time</span>
                      <span className="text-[13px] text-white">~30 seconds</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep("select")} className="flex-1 btn-outline justify-center">Back</button>
                    <button
                      onClick={() => {
                        setStep("processing");
                        setTimeout(() => setStep("success"), 3000);
                      }}
                      className="flex-1 btn-primary justify-center"
                    >
                      Bridge Now
                    </button>
                  </div>
                </div>
              )}

              {step === "processing" && (
                <div className="text-center py-10">
                  <Loader2 className="w-12 h-12 text-[#E9A13F] animate-spin mx-auto mb-6" />
                  <h3 className="text-[20px] font-light text-white mb-2">Bridging...</h3>
                  <p className="text-[14px] text-white/40">
                    Transferring {amount} USDC from {selectedChain?.name} to Arc Testnet
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-[20px] font-light text-white mb-2">Bridge Complete!</h3>
                  <p className="text-[14px] text-white/40 mb-6">{amount} USDC bridged to Arc Testnet</p>
                  <div className="flex gap-3 max-w-[320px] mx-auto">
                    <button onClick={() => { setStep("select"); setAmount(""); }} className="flex-1 btn-outline justify-center">
                      Bridge More
                    </button>
                    <a href="/create" className="flex-1 btn-primary justify-center inline-flex items-center gap-2">
                      Mint NFT <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          <div className="rounded-xl border border-white/10 p-5">
            <Zap className="w-5 h-5 text-[#E9A13F] mb-3" />
            <div className="text-[14px] font-medium text-white mb-1">Instant</div>
            <p className="text-[12px] text-white/40">Circle CCTP enables near-instant cross-chain transfers</p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <Shield className="w-5 h-5 text-[#E9A13F] mb-3" />
            <div className="text-[14px] font-medium text-white mb-1">Secure</div>
            <p className="text-[12px] text-white/40">Native USDC — no wrapped tokens, no bridge risk</p>
          </div>
          <div className="rounded-xl border border-white/10 p-5">
            <Globe className="w-5 h-5 text-[#E9A13F] mb-3" />
            <div className="text-[14px] font-medium text-white mb-1">Multi-Chain</div>
            <p className="text-[12px] text-white/40">Bridge from Ethereum, Base, Arbitrum, Optimism</p>
          </div>
        </div>
      </div>
    </div>
  );
}
